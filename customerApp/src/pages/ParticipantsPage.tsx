import { useEffect, useRef, useState, useCallback } from "react";
import ParticipantItem from "../components/ParticipantItem";
import type { Participant } from "../types/participants-type";
import { Input } from "../components/ui/input";
import { IoIosSearch } from "react-icons/io";

const LIMIT = 20;
const DEBOUNCE_MS = 400;

const ParticipantsPage = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchParticipants = useCallback(async (cursor: string | null, search: string) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsFetching(true);
    try {
      const url = new URL(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/participants`);
      url.searchParams.set("limit", String(LIMIT));
      if (cursor) url.searchParams.set("cursor", cursor);
      if (search) url.searchParams.set("search", search);

      const response = await fetch(url.toString(), {
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
      });
      if (!response.ok) throw new Error("Fehler beim Laden der Teilnehmer.");

      const { data, nextCursor: newCursor } = await response.json();
      setParticipants((prev) => (cursor ? [...prev, ...data] : data));
      setNextCursor(newCursor);
      setHasMore(newCursor !== null);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Error fetching participants:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    setParticipants([]);
    setNextCursor(null);
    setHasMore(true);
    fetchParticipants(null, debouncedSearch);
  }, [debouncedSearch, fetchParticipants]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          fetchParticipants(nextCursor, debouncedSearch);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isFetching, nextCursor, debouncedSearch, fetchParticipants]);

  return (
    <div className="w-full h-screen bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 bg-background border-b border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold">Teilnehmer</h1>
      </div>
      <div className="p-6 w-full">
        <div className="w-full relative mb-4">
          <Input
            className="h-15 w-[35%] pl-14"
            placeholder="Teilnehmer suchen..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <IoIosSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-2xl" />
        </div>
        {participants.length === 0 && !isFetching ? (
          <p className="text-gray-500">
            {debouncedSearch ? `Keine Ergebnisse für „${debouncedSearch}".` : "Keine Teilnehmer gefunden."}
          </p>
        ) : (
          <div className="space-y-1">
            {participants.map((participant) => (
              <ParticipantItem key={participant.id} participant={participant} />
            ))}
          </div>
        )}
        <div ref={sentinelRef} className="py-4 flex justify-center">
          {isFetching && <p className="text-sm text-muted-foreground">Lade weitere Teilnehmer...</p>}
        </div>
      </div>
    </div>
  );
};

export default ParticipantsPage;
