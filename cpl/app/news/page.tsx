'use client'
import { useEffect, useState } from 'react';
import SideBar from "../sidebar";

type TradeLog = {
    id: number
    username: string
    team_name: string
    action: 'BUY' | 'SELL'
    pokemon_or_item: string
    points: number
    trade_date: string
}

export default function News() {
    const [trades, setTrades] = useState<TradeLog[]>([]);
    const [loading, setLoading] = useState(true);
    const bookmarks = [{ id: 'recent-trades', name: 'Trades' }]

    useEffect(() => {
        fetch('/api/tradelog')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTrades(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
            ' at ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    };

    const pokemonTrades = trades.filter(t => {
        // Rough check — items have IDs in the 100s/200s range in your db
        // We distinguish by checking if it's in the item shop names vs pokemon names
        // Simplest approach: check action + whether it appears in item list
        return true; // show all, separated by type below
    });

    const buyTrades = trades.filter(t => t.action === 'BUY');
    const sellTrades = trades.filter(t => t.action === 'SELL');

    return (
        <main className="page">
            <SideBar bookmarks={bookmarks} />
            <div className="window">
                <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>News</h1>

                <div id="recent-trades">
                    <h2 style={{ borderBottom: '2px solid #dee2e6', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                        Recent Trades This Week
                    </h2>

                    {loading ? (
                        <p style={{ color: '#6c757d' }}>Loading trades...</p>
                    ) : trades.length === 0 ? (
                        <p style={{ color: '#6c757d' }}>No trades this week yet.</p>
                    ) : (
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

                            {/* Acquisitions */}
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <h3 style={{ color: '#28a745', marginBottom: '1rem' }}>🟢 Acquisitions</h3>
                                {buyTrades.length === 0 ? (
                                    <p style={{ color: '#6c757d' }}>No purchases this week.</p>
                                ) : (
                                    buyTrades.map(trade => (
                                        <div key={trade.id} style={{
                                            backgroundColor: '#1a3a1a',
                                            border: '1px solid #28a745',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            marginBottom: '8px'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 'bold', color: 'white' }}>{trade.team_name}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{formatDate(trade.trade_date)}</span>
                                            </div>
                                            <div style={{ color: '#ccc', marginTop: '4px' }}>
                                                Acquired <strong style={{ color: 'white' }}>{trade.pokemon_or_item}</strong> for <strong style={{ color: '#e3d109' }}>{trade.points} pts</strong>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Releases */}
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <h3 style={{ color: '#dc3545', marginBottom: '1rem' }}>🔴 Releases</h3>
                                {sellTrades.length === 0 ? (
                                    <p style={{ color: '#6c757d' }}>No releases this week.</p>
                                ) : (
                                    sellTrades.map(trade => (
                                        <div key={trade.id} style={{
                                            backgroundColor: '#3a1a1a',
                                            border: '1px solid #dc3545',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            marginBottom: '8px'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 'bold', color: 'white' }}>{trade.team_name}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{formatDate(trade.trade_date)}</span>
                                            </div>
                                            <div style={{ color: '#ccc', marginTop: '4px' }}>
                                                Released <strong style={{ color: 'white' }}>{trade.pokemon_or_item}</strong> for <strong style={{ color: '#e3d109' }}>{trade.points} pts</strong>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}