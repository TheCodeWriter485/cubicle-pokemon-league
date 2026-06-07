'use client'

import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

type Match = {
  match_id: number | string
  week: string
  done?: boolean | number
  winner?: string
  team_1?: number | string
  team_2?: number | string
  team_1_name?: string
  team_2_name?: string
  team_1_username?: string
  team_2_username?: string
}

const getWeekStart = (date: Date) => {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);

  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);

  return weekStart;
}

const getWeekEnd = (weekStart: Date) => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  return weekEnd;
}

const teamName = (match: Match, side: 1 | 2) => {
  const name = side === 1 ? match.team_1_name : match.team_2_name;
  const username = side === 1 ? match.team_1_username : match.team_2_username;
  const id = side === 1 ? match.team_1 : match.team_2;

  return name || username || `Team ${id}`;
}

const winnerName = (match: Match) => {
  if (!match.winner) return "";
  if ([match.team_1_name, match.team_1_username].includes(match.winner)) return teamName(match, 1);
  if ([match.team_2_name, match.team_2_username].includes(match.winner)) return teamName(match, 2);

  return match.winner;
}

const matchSummary = (match: Match) => {
  const team1 = teamName(match, 1);
  const team2 = teamName(match, 2);

  if (match.done && match.winner) {
    const winner = winnerName(match);
    const loser = winner === team1 ? team2 : winner === team2 ? team1 : "";

    return loser ? `${winner} defeated ${loser}` : `${winner} won vs ${team1} / ${team2}`;
  }

  return ` ${team1} vs ${team2}|`;
}

export default function NewsMarquee() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch('http://129.80.79.84:3030/matches')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMatches(data);
        }
      })
      .catch(console.error);
  }, []);

  const weekStart = getWeekStart(new Date());
  const weekEnd = getWeekEnd(weekStart);
  const currentWeekMatches = matches
    .filter(match => {
      const matchDate = new Date(match.week);
      return matchDate >= weekStart && matchDate < weekEnd;
    })
    .sort((a, b) => Number(Boolean(b.done)) - Number(Boolean(a.done)));

  const marqueeItems = currentWeekMatches.length > 0
    ? ["ANNOUNCING THIS WEEK'S MATCHES~~~ |", ...currentWeekMatches.map(matchSummary)]
    : ["No matches scheduled for this week"];

  return (
    <div className="chyron">
      <Marquee>
        {marqueeItems.map((item, index) => (
          <span key={`${item}-${index}`} className="mx-8">
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
