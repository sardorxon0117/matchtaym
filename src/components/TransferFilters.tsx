"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function TransferFilters({
  initialClub,
  initialLeague,
  leagues,
}: {
  initialClub: string;
  initialLeague: string;
  leagues: string[];
}) {
  const [club, setClub] = useState(initialClub);
  const [league, setLeague] = useState(initialLeague);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function navigate(nextClub: string, nextLeague: string) {
    const params = new URLSearchParams();
    if (nextClub) params.set("club", nextClub);
    if (nextLeague) params.set("league", nextLeague);
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/transferlar?${qs}` : "/transferlar");
    });
  }

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => navigate(club.trim(), league), 350);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [club]);

  function onLeagueChange(next: string) {
    setLeague(next);
    navigate(club.trim(), next);
  }

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <input
        type="text"
        value={club}
        onChange={(e) => setClub(e.target.value)}
        placeholder="Klub nomi bo'yicha qidirish"
        className="input max-w-xs"
      />
      <select value={league} onChange={(e) => onLeagueChange(e.target.value)} className="input max-w-xs">
        <option value="">Barcha ligalar</option>
        {leagues.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
