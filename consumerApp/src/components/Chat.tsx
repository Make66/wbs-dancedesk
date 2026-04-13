import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { env } from '@/config/env';
import { useAuthState } from '@/features/auth/useAuthState';
import { useUserStore } from '@/store/user';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ScreenHeader } from '@/components/ScreenHeader';

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = { id: string; role: 'user' | 'assistant'; content: string };

type Settings = { basic?: { domain?: string } };

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse raw SSE chunk bytes into plain text tokens.
 * Each line is: `data: <JSON-string | raw-string | [DONE]>`
 */
function parseSseTokens(chunk: string): string {
  let result = '';
  for (const line of chunk.split('\n')) {
    if (!line.startsWith('data: ')) continue;
    const raw = line.slice(6).trim();
    if (raw === '[DONE]') continue;
    try {
      result += JSON.parse(raw) as string;
    } catch {
      result += raw;
    }
  }
  return result;
}

/**
 * The server instructs the LLM to emit `[REGISTER:<courseId>]` when the
 * participant confirms they want to enroll in a course. This helper strips
 * those markers from the visible text and returns the extracted course IDs.
 */
const REGISTER_RE = /\[REGISTER:([a-zA-Z0-9-]+)\]/g;

function extractRegistrations(text: string): { cleanText: string; courseIds: string[] } {
  const courseIds: string[] = [];
  const cleanText = text
    .replace(REGISTER_RE, (_, id: string) => {
      courseIds.push(id);
      return '';
    })
    .trim();
  return { cleanText, courseIds };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Chat() {
  const { colors } = useAppTheme();
  const { user } = useAuthState();
  const participant = useUserStore((s) => s.participant);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tenantDomain, setTenantDomain] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [expired, setExpired] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const listRef = useRef<FlatList<Message>>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  // ── Session ────────────────────────────────────────────────────────────────

  /**
   * Fetch tenant settings once, then open the chat session.
   * Domain is passed to the proxy so the server can inject it into the
   * system prompt (e.g. for the registration link hint).
   * On reconnect the cached `tenantDomain` state is reused.
   */
  const initialize = useCallback(async () => {
    if (!user) return;

    let domain = tenantDomain;

    // Fetch domain from settings if not yet known
    if (!domain) {
      try {
        const res = await fetch(`${env.apiBaseUrl}/settings`, { credentials: 'include' });
        if (res.ok) {
          const data = (await res.json()) as Settings;
          domain = data.basic?.domain ?? null;
          if (domain) setTenantDomain(domain);
        }
      } catch {
        // domain is optional — continue without it
      }
    }

    // Reset UI state
    setExpired(false);
    setSessionError(null);
    setMessages([]);
    setSessionId(null);

    try {
      const res = await fetch(env.chatProxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          participantId: user.id,
          tenantId: user.tenantId,
          ...(domain ? { domain } : {}),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { sessionId: string };
      setSessionId(data.sessionId);
    } catch {
      setSessionError('Chat konnte nicht gestartet werden. Bitte erneut versuchen.');
    }
  }, [user, tenantDomain]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => () => xhrRef.current?.abort(), []);

  // ── Registration ───────────────────────────────────────────────────────────

  /**
   * Called when the LLM emits a [REGISTER:<courseId>] action marker.
   * Uses stored participant data — no extra fetch needed.
   * Appends a synthetic assistant confirmation bubble after the API call.
   */
  const performRegistration = useCallback(
    async (courseId: string) => {
      if (!participant) return;
      setRegistering(true);

      try {
        const res = await fetch(`${env.apiBaseUrl}/registrations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            firstName: participant.firstName,
            lastName: participant.lastName,
            email: participant.email,
            ...(participant.phone ? { phone: participant.phone } : {}),
            ...(participant.street ? { street: participant.street } : {}),
            ...(participant.city ? { city: participant.city } : {}),
            ...(participant.zipCode ? { zipCode: participant.zipCode } : {}),
            courseId,
          }),
        });

        setMessages((prev) => [
          ...prev,
          {
            id: `reg-${Date.now()}`,
            role: 'assistant',
            content: res.ok
              ? `Deine Anmeldung war erfolgreich! Wir freuen uns, dich bald auf der Tanzfläche zu sehen. 🎉`
              : `Die Anmeldung konnte leider nicht abgeschlossen werden (Fehler ${res.status}). Bitte melde dich direkt über unsere Website an.`,
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `reg-err-${Date.now()}`,
            role: 'assistant',
            content: 'Verbindungsfehler bei der Anmeldung. Bitte versuche es über unsere Website.',
          },
        ]);
      } finally {
        setRegistering(false);
      }
    },
    [participant]
  );

  // ── Messaging ──────────────────────────────────────────────────────────────

  const sendMessage = useCallback(() => {
    if (!sessionId || !input.trim() || streaming || expired || registering) return;

    const prompt = input.trim();
    setInput('');

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: prompt };
    const assistantId = `a-${Date.now()}`;
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: 'assistant', content: '' }]);
    setStreaming(true);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    let lastOffset = 0;
    let assembled = '';

    xhr.open('POST', `${env.chatProxyUrl}/messages`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true;

    xhr.onprogress = () => {
      const chunk = xhr.responseText.slice(lastOffset);
      lastOffset = xhr.responseText.length;
      const tokens = parseSseTokens(chunk);
      if (!tokens) return;
      assembled += tokens;
      const snapshot = assembled;
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: snapshot } : m))
      );
    };

    xhr.onload = () => {
      if (xhr.status === 410) {
        setExpired(true);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } else if (xhr.status >= 400) {
        setSessionError(`Fehler ${xhr.status}. Bitte erneut versuchen.`);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } else {
        // Strip action markers from display text, then trigger side-effects
        const { cleanText, courseIds } = extractRegistrations(assembled);
        if (courseIds.length > 0) {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: cleanText } : m))
          );
          courseIds.forEach((id) => performRegistration(id));
        }
      }
      setStreaming(false);
      xhrRef.current = null;
    };

    xhr.onerror = () => {
      setSessionError('Verbindungsfehler. Bitte erneut versuchen.');
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      setStreaming(false);
      xhrRef.current = null;
    };

    xhr.send(JSON.stringify({ sessionId, prompt }));
  }, [sessionId, input, streaming, expired, registering, performRegistration]);

  // ── Render ─────────────────────────────────────────────────────────────────

  const canSend = !!sessionId && !!input.trim() && !streaming && !expired && !registering;
  const busy = streaming || registering;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Tanzschul-Assistent" action={{ label: 'Neuer Chat', onPress: initialize }} />

      {/* Status banner (expired / error) */}
      {(expired || sessionError) && (
        <View
          style={[
            styles.banner,
            {
              backgroundColor: expired ? colors.primaryMuted : '#FEE4E2',
              borderColor: expired ? colors.primary : colors.danger,
            },
          ]}
        >
          <Text style={{ color: expired ? colors.primary : colors.danger, fontSize: 14, flex: 1 }}>
            {expired ? 'Sitzung abgelaufen.' : sessionError}
          </Text>
          <Pressable onPress={initialize}>
            <Text
              style={{
                color: expired ? colors.primary : colors.danger,
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              Neu verbinden
            </Text>
          </Pressable>
        </View>
      )}

      {/* Registering progress bar */}
      {registering && (
        <View style={[styles.progressBar, { backgroundColor: colors.primaryMuted }]}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={{ color: colors.primary, fontSize: 13, marginLeft: 8 }}>
            Anmeldung wird verarbeitet…
          </Text>
        </View>
      )}

      {/* Message list */}
      {!sessionId && !sessionError ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => {
            const isUser = item.role === 'user';
            const showDots = !isUser && streaming && item.content === '';
            return (
              <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
                <View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor: isUser ? colors.primary : colors.surface,
                      borderColor: isUser ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{ color: isUser ? '#fff' : colors.text, fontSize: 15, lineHeight: 22 }}
                  >
                    {showDots ? '•••' : item.content}
                  </Text>
                </View>
              </View>
            );
          }}
          contentContainerStyle={[styles.list, messages.length === 0 && styles.listEmpty]}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text
                style={{ color: colors.textMuted, textAlign: 'center', fontSize: 15, lineHeight: 24 }}
              >
                {'Hallo! Frag mich zu Kursen,\nEvents oder ums Tanzen. 💃'}
              </Text>
            </View>
          }
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {/* Input bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View
          style={[
            styles.inputBar,
            { borderTopColor: colors.border, backgroundColor: colors.surface },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              { color: colors.text, backgroundColor: colors.surfaceAlt, borderColor: colors.border },
            ]}
            placeholder="Nachricht eingeben…"
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={2000}
            editable={!!sessionId && !expired && !registering}
            returnKeyType="send"
            blurOnSubmit
            onSubmitEditing={sendMessage}
          />
          <Pressable
            onPress={sendMessage}
            disabled={!canSend}
            style={[styles.sendBtn, { backgroundColor: canSend ? colors.primary : colors.border }]}
          >
            {busy ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendIcon}>↑</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },

  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },

  list: { padding: 16, gap: 10 },
  listEmpty: { flex: 1 },

  row: { flexDirection: 'row', marginVertical: 3 },
  rowUser: { justifyContent: 'flex-end' },
  rowAssistant: { justifyContent: 'flex-start' },

  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 120,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { color: '#fff', fontSize: 20, fontWeight: '700', lineHeight: 24 },
});
