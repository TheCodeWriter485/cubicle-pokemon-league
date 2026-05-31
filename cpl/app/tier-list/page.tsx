'use client'
import { useEffect, useState } from 'react'
import SideBar from "../sidebar";
import Card from "../card";

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
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [totalImages, setTotalImages] = useState(0);

    async function fetchPokemon() {
        const res = await fetch('http://localhost:3030/pokedata');
        const data = await res.json();

        let arr: any[][] = Array.from({ length: 21 }, () => []);
        let count = 0;
        data.forEach((poke: any) => {
            if (poke.PointValue <= 20) {
                arr[poke.PointValue].push(poke);
                count++;
            }
        });
        setPokemon(arr);
        setTotalImages(count);

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

    // Hide loading screen once all images have loaded
    useEffect(() => {
        if (totalImages > 0 && imagesLoaded >= totalImages) {
            setLoading(false);
        }
    }, [imagesLoaded, totalImages]);

    const handleImageLoad = () => {
        setImagesLoaded(prev => prev + 1);
    };

    const bookmarks = [{ id: 1, name: 'button' }]
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
                        {totalImages > 0 && (
                            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                                {imagesLoaded} / {totalImages} Pokémon loaded
                            </p>
                        )}
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
                                                onImageLoad={handleImageLoad}
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