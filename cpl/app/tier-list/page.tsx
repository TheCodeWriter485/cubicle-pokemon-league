'use client'
import { useEffect, useState } from 'react'
import SideBar from "../sidebar";
import Card from "../card";

function isDraftActive(schedule: any[]): boolean {
    if (!schedule || schedule.length === 0) return false;

    const now = new Date();

    // Find Minor league start (earliest) and Major league end (latest)
    const minor = schedule.find(s => s.league === 'Minor');
    const major = schedule.find(s => s.league === 'Major');

    if (!minor || !major) return false;

    // Poll window: from Minor start_time to end of Major draft_date
    const minorStart = new Date(`${minor.draft_date?.split('T')[0]}T${minor.start_time}`);
    const majorEnd = new Date(`${major.draft_date?.split('T')[0]}T23:59:59`);

    return now >= minorStart && now <= majorEnd;
}

export default function TierList() {
    const [pokemon, setPokemon] = useState<any[][]>([]);
    const [ownership, setOwnership] = useState<Record<string, string | null>>({});
    const [draftSchedule, setDraftSchedule] = useState<any[]>([]);

    async function fetchPokemon() {
        const res = await fetch('http://localhost:3030/pokedata');
        const data = await res.json();

        let arr: any[][] = Array.from({ length: 21 }, () => []);
        data.forEach((poke: any) => {
            if (poke.PointValue <= 20) {
                arr[poke.PointValue].push(poke);
            }
        });
        setPokemon(arr);

        const ownerMap: Record<string, string | null> = {};
        data.forEach((poke: any) => {
            ownerMap[poke.NamePoke] = poke.OwnedBy ?? null;
        });
        setOwnership(ownerMap);
    }

    async function fetchSchedule() {
        const res = await fetch('http://localhost:3030/draft/schedule');
        const data = await res.json();
        setDraftSchedule(data);
    }

    useEffect(() => {
        fetchPokemon();
        fetchSchedule();
    }, []);

    useEffect(() => {
        if (draftSchedule.length === 0) return;

        const active = isDraftActive(draftSchedule);
        const POLL_INTERVAL = active ? 3000 : 30000;

        const interval = setInterval(() => {
            fetchPokemon();
        }, POLL_INTERVAL);

        return () => clearInterval(interval);
    }, [draftSchedule]);

    const bookmarks = [{ id: 1, name: 'button' }]
    const reversedTiers = [...pokemon].reverse();

    return (
        <main className="page">
            <SideBar bookmarks={bookmarks} />
            <div className="window">
                <h1>Tier List</h1>
                {reversedTiers.map((tier, index) => {
                    const tierIndex = 20 - index;
                    return (
                        <div key={tierIndex} style={{ marginBottom: '2rem' }}>
                            <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', borderBottom: '2px solid #dee2e6', marginBottom: '12px' }}>
                                {tierIndex} Points
                            </h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
                                {tier.length > 0
                                    ? tier.map((poke: any, pokeIndex: number) => (
                                        <div key={pokeIndex} className="pokemon-card">
                                            <Card
                                                name={poke.NamePoke}
                                                value={poke.PointValue}
                                                image={poke.ID}
                                                ownedByOverride={ownership[poke.NamePoke]}
                                            />
                                        </div>
                                    ))
                                    : <p style={{ color: '#6c757d' }}>No Pokémon at this tier</p>
                                }
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}