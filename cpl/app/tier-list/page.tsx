'use client'
import { useEffect, useState } from 'react'
import SideBar from "../sidebar";
import Card from "../card";

function isTradingAllowed(schedule: any[]): boolean {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday

    // Always allow on Sundays
    if (day === 0) return true;

    // Allow during draft window
    return isDraftActive(schedule);
}

function isDraftActive(schedule: any[]): boolean {
    if (!schedule || schedule.length === 0) return false;

    const now = new Date();
    const minor = schedule.find(s => s.league === 'Minor');
    const major = schedule.find(s => s.league === 'Major');

    if (!minor || !major) return false;

    const minorStart = new Date(`${minor.draft_date?.split('T')[0]}T${minor.start_time}`);
    const majorEnd = new Date(`${major.draft_date?.split('T')[0]}T23:59:59`);

    return now >= minorStart && now <= majorEnd;
}

export default function TierList() {
    const [pokemon, setPokemon] = useState<any[][]>([]);
    const [ownership, setOwnership] = useState<Record<string, string | null>>({});
    const [draftSchedule, setDraftSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tradingAllowed, setTradingAllowed] = useState(false);

async function fetchPokemon() {
    const res = await fetch('http://129.80.79.84:3030/pokedata');
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

    // Hide loading screen once data is ready
    setLoading(false);
}

    async function fetchSchedule() {
        const res = await fetch('http://129.80.79.84:3030/draft/schedule');
        const data = await res.json();
        setDraftSchedule(data);
        setTradingAllowed(isTradingAllowed(data));
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

    const bookmarks = [
    { id: "tier-20", name: '20' },
    { id: "tier-19", name: '19' },
    { id: "tier-18", name: '18' },
    { id: "tier-17", name: '17' },
    { id: "tier-16", name: '16' },
    { id: "tier-15", name: '15' },
    { id: "tier-14", name: '14' },
    { id: "tier-13", name: '13' },
    { id: "tier-12", name: '12' },
    { id: "tier-11", name: '11' },
    { id: "tier-10", name: '10' },
    { id: "tier-9", name: '9' },
    { id: "tier-8", name: '8' },
    { id: "tier-7", name: '7' },
    { id: "tier-6", name: '6' },
    { id: "tier-5", name: '5' },
    { id: "tier-4", name: '4' },
    { id: "tier-3", name: '3' },
    { id: "tier-2", name: '2' },
    { id: "tier-1", name: '1' },
    { id: "tier-0", name: '0' }
]
    const reversedTiers = [...pokemon].reverse();

    return (
        <main className="page">
            <SideBar bookmarks={bookmarks} />
            <div className="window">

                {/* Loading Screen */}
                {loading && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 99999
                    }}>
                        <img
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
                            style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'contain',
                                animation: 'spin 1.5s linear infinite'
                            }}
                        />
                        <p style={{
                            color: 'white',
                            fontSize: '1.5rem',
                            marginTop: '1rem',
                            fontWeight: 'bold',
                            letterSpacing: '2px'
                        }}>
                            Loading...
                        </p>
                        <style>{`
                            @keyframes spin {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                )}

                <h1>Tier List</h1>
                {reversedTiers.map((tier, index) => {
                    const tierIndex = 20 - index;
                    return (
                        <div key={tierIndex} id={`tier-${tierIndex}`} style={{ marginBottom: '2rem' }}>
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
                                                tradingAllowed={tradingAllowed}
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