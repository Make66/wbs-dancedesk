import { FlatList, View, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { useMyCoursesStore } from "@/store/myCourses";
import { useEventsStore } from "@/store/events";
import { useCourseWeekStore } from "@/store/courseWeek";
import { useEffect } from 'react';
import { useAppTheme } from '@/theme/ThemeProvider';
import { LogBox } from 'react-native';

// Ignore specific warnings that are known and not critical for our app's functionality
// likely inside react-navigation, react-native-reanimated, or a gesture handler
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated. Use style.pointerEvents',
]);

export default function HomeTab() {
  const { colors } = useAppTheme();
  const courses = useMyCoursesStore((state) => state.courses);
  const events = useEventsStore((state) => state.events);
  const courseWeek = useCourseWeekStore((state) => state.courseWeek);

  useEffect(() => {
    console.log('[7] HOME TAB: courses available in component —', courses.length, 'course(s):', courses);
  }, [courses]);

  useEffect(() => {
    console.log('[7] HOME TAB: events available in component —', events.length, 'event(s):', events);
  }, [events]);

  useEffect(() => {
    console.log('[7] HOME TAB: courseWeek available in component —', courseWeek);
  }, [courseWeek]);

  return (
    <Screen header={<ScreenHeader title="Home" showLogout />}>
      <Card>
        <ThemedText style={styles.title}>Aktuelles</ThemedText>
        <ThemedText>
          Hier findest Du Deine aktuellsten Informationen.
        </ThemedText>
      </Card>

      <Card>
        <ThemedText style={styles.section}>Deine aktuellen Kurse</ThemedText>
        {courses.map((course) => (
          <View key={course.id}>
            <ThemedText>{course.name}</ThemedText>
            <FlatList
              data={[...course.dates].sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              )}
              keyExtractor={(item) => item.date}
              renderItem={({
                item,
              }: {
                item: { date: string; isStart: boolean };
              }) => (
                <View style={styles.dateRow}>
                  <ThemedText style={styles.bullet}>•</ThemedText>
                  <ThemedText style={styles.dateText}>
                    {new Date(item.date)
                      .toLocaleDateString("de-DE", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                      .replace(",", "")
                      .replace(/(\d{2}:\d{2})/, "$1 Uhr")}
                    {item.isStart ? " (Start)" : ""}
                  </ThemedText>
                </View>
              )}
            />
          </View>
        ))}
      </Card>

      <Card>
        <ThemedText style={styles.section}>Deine nächsten Events</ThemedText>
        {events.map((event) => (
          <View key={event.id}>
            <ThemedText style={styles.dayHeader}>{event.title}</ThemedText>
            {event.startsAt ? (
              <ThemedText style={styles.dateText}>
                {new Date(event.startsAt as string)
                  .toLocaleDateString("de-DE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .replace(",", "")
                  .replace(/(\d{2}:\d{2})/, "$1 Uhr")}
              </ThemedText>
            ) : null}
          </View>
        ))}
      </Card>

      <Card>
        <ThemedText style={styles.section}>Aktuelle Kurswoche</ThemedText>
        {courseWeek ? (
          [
            "Montag",
            "Dienstag",
            "Mittwoch",
            "Donnerstag",
            "Freitag",
            "Samstag",
            "Sonntag",
          ].map((dayName, i) => {
            const entries = courseWeek[String(i)] ?? [];
            if (entries.length === 0) return null;
            return (
              <View key={i} style={styles.dayBlock}>
                <ThemedText style={styles.dayHeader}>{dayName}</ThemedText>
                {entries.map((entry) => (
                  <View key={entry.id} style={styles.courseEntry}>
                    <ThemedText style={styles.categoryName}>
                      {new Date(entry.startsAt).toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      &nbsp;
                      {entry.category?.name ?? "—"}{" "}
                    </ThemedText>
                    <ThemedText>{entry.name}</ThemedText>
                    {entry.room && (
                      <ThemedText style={styles.roomName}>
                        {entry.room.name}
                      </ThemedText>
                    )}
                  </View>
                ))}
              </View>
            );
          })
        ) : (
          <ThemedText>Keine Kurswoche verfügbar</ThemedText>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "700" },
  section: { fontSize: 18, fontWeight: "600" },
  button: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  dayBlock: { marginTop: 10, gap: 10 },
  dayHeader: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
  courseEntry: { paddingLeft: 8, gap: 1 },
  categoryName: { fontSize: 13, fontWeight: "600", opacity: 0.6 },
  roomName: { fontSize: 13, opacity: 0.5 },
  dateRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "flex-start",
    paddingVertical: 2,
  },
  bullet: { fontSize: 15, lineHeight: 22 },
  dateText: { flex: 1, fontSize: 13, lineHeight: 20 },
});
