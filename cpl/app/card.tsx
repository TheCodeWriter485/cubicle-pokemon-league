'use client'
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

// ── TYPE CHART ────────────────────────────────────────────────────────────────

const TYPE_CHART: Record<string, { weak: string[], resist: string[], immune: string[] }> = {
    Normal:   { weak: ['Fighting'],                                    resist: [],                                                                              immune: ['Ghost'] },
    Fire:     { weak: ['Water','Ground','Rock'],                       resist: ['Fire','Grass','Ice','Bug','Steel','Fairy'],                                     immune: [] },
    Water:    { weak: ['Electric','Grass'],                            resist: ['Fire','Water','Ice','Steel'],                                                   immune: [] },
    Electric: { weak: ['Ground'],                                      resist: ['Electric','Flying','Steel'],                                                    immune: [] },
    Grass:    { weak: ['Fire','Ice','Poison','Flying','Bug'],          resist: ['Water','Electric','Grass','Ground'],                                            immune: [] },
    Ice:      { weak: ['Fire','Fighting','Rock','Steel'],              resist: ['Ice'],                                                                          immune: [] },
    Fighting: { weak: ['Flying','Psychic','Fairy'],                    resist: ['Bug','Rock','Dark'],                                                            immune: [] },
    Poison:   { weak: ['Ground','Psychic'],                            resist: ['Grass','Fighting','Poison','Bug','Fairy'],                                      immune: [] },
    Ground:   { weak: ['Water','Grass','Ice'],                         resist: ['Poison','Rock'],                                                                immune: ['Electric'] },
    Flying:   { weak: ['Electric','Ice','Rock'],                       resist: ['Grass','Fighting','Bug'],                                                       immune: ['Ground'] },
    Psychic:  { weak: ['Bug','Ghost','Dark'],                          resist: ['Fighting','Psychic'],                                                           immune: [] },
    Bug:      { weak: ['Fire','Flying','Rock'],                        resist: ['Grass','Fighting','Ground'],                                                    immune: [] },
    Rock:     { weak: ['Water','Grass','Fighting','Ground','Steel'],   resist: ['Normal','Fire','Poison','Flying'],                                              immune: [] },
    Ghost:    { weak: ['Ghost','Dark'],                                resist: ['Poison','Bug'],                                                                 immune: ['Normal','Fighting'] },
    Dragon:   { weak: ['Ice','Dragon','Fairy'],                        resist: ['Fire','Water','Electric','Grass'],                                              immune: [] },
    Dark:     { weak: ['Fighting','Bug','Fairy'],                      resist: ['Ghost','Dark'],                                                                 immune: ['Psychic'] },
    Steel:    { weak: ['Fire','Fighting','Ground'],                    resist: ['Normal','Grass','Ice','Flying','Psychic','Bug','Rock','Dragon','Steel','Fairy'], immune: ['Poison'] },
    Fairy:    { weak: ['Poison','Steel'],                              resist: ['Fighting','Bug','Dark'],                                                        immune: ['Dragon'] },
};

function calcTypeMatchup(types: string[]) {
    const ALL_TYPES = Object.keys(TYPE_CHART);
    const mult: Record<string, number> = {};
    for (const atk of ALL_TYPES) mult[atk] = 1;
    for (const defType of types) {
        const c = TYPE_CHART[defType];
        if (!c) continue;
        for (const atk of c.weak)   { if (mult[atk] !== undefined) mult[atk] *= 2; }
        for (const atk of c.resist) { if (mult[atk] !== undefined) mult[atk] *= 0.5; }
        for (const atk of c.immune) { if (mult[atk] !== undefined) mult[atk] = 0; }
    }
    const weak: string[] = [], resist: string[] = [], immune: string[] = [];
    for (const [atk, m] of Object.entries(mult)) {
        if (m === 0) immune.push(atk);
        else if (m > 1) weak.push(atk);
        else if (m < 1) resist.push(atk);
    }
    return { weak, resist, immune };
}

// ── STAT COLORS ───────────────────────────────────────────────────────────────

const statColors: Record<string, string> = {
    'hp': '#ff5959', 'attack': '#f5ac78', 'defense': '#fae078',
    'special-attack': '#9db7f5', 'special-defense': '#a7db8d', 'speed': '#fa92b2',
};

// ── CENTRE MODAL ──────────────────────────────────────────────────────────────

function CentreModal({ onClose, children }: { onClose: () => void, children: React.ReactNode }) {
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [onClose]);
    return (
        <>
            <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1100, backdropFilter: 'blur(1px)' }} />
            <div style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '340px', maxHeight: '80vh', overflowY: 'auto',
                background: '#1a1a1a', border: '2px solid #e3d109',
                borderRadius: '10px', zIndex: 1101, padding: '20px 20px 16px',
            }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '12px', background: 'none', border: 'none', color: '#aaa', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                {children}
            </div>
        </>
    );
}

// ── TYPE MATCHUP MODAL ────────────────────────────────────────────────────────

function TypeMatchupModal({ types, onClose }: { types: string[], onClose: () => void }) {
    const { weak, resist, immune } = calcTypeMatchup(types);
    const Row = ({ label, items, color }: { label: string, items: string[], color: string }) =>
        items.length > 0 ? (
            <div style={{ marginBottom: '8px' }}>
                <span style={{ color, fontWeight: 'bold', fontSize: '0.82rem' }}>{label}: </span>
                <span style={{ color: '#ccc', fontSize: '0.82rem' }}>{items.join(', ')}</span>
            </div>
        ) : null;
    return (
        <CentreModal onClose={onClose}>
            <div style={{ color: '#e3d109', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '14px', paddingRight: '20px' }}>
                {types.join(' / ')} — Type Matchups
            </div>
            <Row label="Weaknesses"  items={weak}   color="#ff6b6b" />
            <Row label="Resistances" items={resist}  color="#69db7c" />
            <Row label="Immunities"  items={immune}  color="#74c0fc" />
            {weak.length === 0 && resist.length === 0 && immune.length === 0 && (
                <div style={{ color: '#888', fontSize: '0.82rem' }}>No special matchups.</div>
            )}
            <div style={{ color: '#555', fontSize: '0.7rem', marginTop: '12px' }}>Click anywhere outside to close</div>
        </CentreModal>
    );
}

// ── ABILITY INFO MODAL ────────────────────────────────────────────────────────

function AbilityModal({ abilityName, onClose }: { abilityName: string, onClose: () => void }) {
    const [desc, setDesc] = useState<string | null>(null);
    useEffect(() => {
        const slug = abilityName.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        fetch(`https://pokeapi.co/api/v2/ability/${slug}`)
            .then(r => r.json())
            .then(data => {
                const entry =
                    data.effect_entries?.find((e: any) => e.language.name === 'en')?.short_effect ||
                    data.flavor_text_entries?.find((e: any) => e.language.name === 'en')?.flavor_text ||
                    'No description available.';
                setDesc(entry);
            })
            .catch(() => setDesc('Could not load ability description.'));
    }, [abilityName]);
    return (
        <CentreModal onClose={onClose}>
            <div style={{ color: '#e3d109', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '12px', textTransform: 'capitalize', paddingRight: '20px' }}>
                {abilityName}
            </div>
            <p style={{ color: '#ccc', fontSize: '0.85rem', margin: 0, lineHeight: 1.55 }}>{desc ?? 'Loading…'}</p>
        </CentreModal>
    );
}

// ── CLICKABLE BADGES ──────────────────────────────────────────────────────────

function TypeBadge({ type, allTypes }: { type: string, allTypes: string[] }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <span
                onClick={e => { e.stopPropagation(); setOpen(true); }}
                style={{ background: '#333', borderRadius: '4px', padding: '3px 10px', color: '#fff', fontSize: '0.78rem', textTransform: 'capitalize', cursor: 'pointer', border: '1px solid #555', transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#e3d109')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#555')}
            >{type}</span>
            {open && <TypeMatchupModal types={allTypes} onClose={() => setOpen(false)} />}
        </>
    );
}

function AbilityBadge({ name }: { name: string }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <span
                onClick={e => { e.stopPropagation(); setOpen(true); }}
                style={{ background: '#222', border: '1px solid #444', borderRadius: '4px', padding: '3px 8px', color: '#fff', fontSize: '0.78rem', textTransform: 'capitalize', fontStyle: 'normal', cursor: 'pointer', transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#e3d109')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#444')}
            >
                {name}
            </span>
            {open && <AbilityModal abilityName={name} onClose={() => setOpen(false)} />}
        </>
    );
}

// ── SHARED UI ─────────────────────────────────────────────────────────────────

function Backdrop({ onClick }: { onClick: () => void }) {
    return <div onClick={onClick} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, backdropFilter: 'blur(2px)' }} />;
}

function SidePanel({ show, onClose, children }: { show: boolean, onClose: () => void, children: React.ReactNode }) {
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [onClose]);
    return (
        <div style={{
            position: 'fixed', top: 0, right: 0, height: '100vh', width: '320px',
            background: '#111', borderLeft: '2px solid #e3d109', zIndex: 1001,
            transform: show ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
            display: 'flex', flexDirection: 'column', overflowY: 'auto',
        }}>{children}</div>
    );
}

function PanelHeader({ title, subtitle, imgSrc, onClose }: { title: string, subtitle?: string, imgSrc?: string, onClose: () => void }) {
    return (
        <div style={{ background: '#1a1a1a', borderBottom: '1px solid #e3d109', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {imgSrc && <img src={imgSrc} alt={title} style={{ width: 52, height: 52, objectFit: 'contain', alignItems: 'center' }} />}
                <div>
                    <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>{title}</div>
                    {subtitle && <div style={{ color: '#e3d109', fontSize: '0.8rem' }}>{subtitle}</div>}
                </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1, padding: '0 4px' }} aria-label="Close">✕</button>
        </div>
    );
}

function InfoBox({ label, children }: { label: string, children: React.ReactNode }) {
    return (
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '14px 16px', marginBottom: '14px' }}>
            <div style={{ color: '#e3d109', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>{label}</div>
            {children}
        </div>
    );
}

function StatBar({ name, value }: { name: string, value: number }) {
    const pct = Math.round((value / 255) * 100);
    const color = statColors[name] ?? '#e3d109';
    return (
        <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ color: '#aaa', fontSize: '0.72rem', textTransform: 'capitalize' }}>{name.replace(/-/g, ' ')}</span>
                <span style={{ color: '#fff', fontSize: '0.72rem', fontWeight: 'bold' }}>{value}</span>
            </div>
            <div style={{ background: '#2a2a2a', borderRadius: '3px', height: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.4s ease' }} />
            </div>
        </div>
    );
}

// ── CARD ──────────────────────────────────────────────────────────────────────

export default function Card(props: {
    name: string,
    value: number,
    image: number,
    ownedByOverride?: string | null,
    tradingAllowed?: boolean
}) {
    const [showPanel, setShowPanel] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [pokeStats, setPokeStats] = useState<any>(null);
    const [ownedBy, setOwnedBy] = useState<string | null>(null);

    // Sync ownedBy with parent override
    useEffect(() => {
        if (props.ownedByOverride !== undefined) setOwnedBy(props.ownedByOverride ?? null);
    }, [props.ownedByOverride]);

    useEffect(() => {
        checkLogin();
        if (props.ownedByOverride === undefined) checkOwnership();
    }, []);

    async function checkLogin() {
        const res = await fetch('/api/auth/status', { credentials: 'include' });
        const data = await res.json();
        setLoggedIn(data.loggedin);
        setUsername(data.username);
    }

    async function checkOwnership() {
        try {
            const res = await fetch(`/api/pokemon/ownership/${props.name}`);
            const data = await res.json();
            setOwnedBy(data.OwnedBy ?? null);
        } catch (err) { console.warn('Could not fetch ownership data:', err); }
    }

    async function fetchPokeData() {
        if (pokeStats) return;
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${props.image}`);
        setPokeStats(await res.json());
    }

    function handleCardClick() {
        if (!props.tradingAllowed && !ownedBy) {
            alert('Purchasing is only available on draft day or Sundays.');
            return;
        }
        setShowPanel(true);
        fetchPokeData();
    }

    async function handlePurchase() {
        if (!loggedIn) {
            alert('You must be logged in to purchase a Pokemon.');
            return;
        }
        if (ownedBy !== null) {
            alert(`${props.name} is already owned by ${ownedBy}.`);
            setShowPanel(false);
            return;
        }

        const teams = await (await fetch('/api/team')).json();
        const userTeam = teams.find((t: any) => t.Username === username);
        if (!userTeam) { alert('No team found for your account.'); return; }

        if (userTeam.trades !== null && userTeam.trades !== undefined && userTeam.trades < 1) {
            alert('You have no more trades for the season!');
            setShowPanel(false);
            return;
        }

        const now = new Date();
        if (now.getDay() === 0) {
            const matchData = await (await fetch(`/api/matches/team/${userTeam.id}`)).json();
            const lastMonday = new Date(now); lastMonday.setDate(now.getDate() - 6); lastMonday.setHours(0, 0, 0, 0);
            const lastSunday = new Date(now); lastSunday.setDate(now.getDate() - 1); lastSunday.setHours(23, 59, 59, 999);
            const incompleteLastWeek = matchData.find((m: any) => {
                const d = new Date(m.week);
                return d >= lastMonday && d <= lastSunday && !m.done;
            });
            /*if (incompleteLastWeek) {
                alert('You cannot trade on Sunday until your match from last week has been completed.');
                setShowPanel(false);
                return;
            }*/
        }

        const fullTeams = await (await fetch('/api/team/full')).json();
        const userFullTeam = fullTeams.find((t: any) => t.Username === username);

        if (userFullTeam && userFullTeam.members.length >= 10) {
            alert('You already have 10 Pokémon on your team and cannot purchase more.');
            setShowPanel(false);
            return;
        }

        if (Number(props.value) >= 17) {
            const allPokeData = await (await fetch('/api/pokedata')).json();
            const highValueCount = userFullTeam.members.filter((m: any) => {
                const p = allPokeData.find((p: any) => p.NamePoke === m.pokemon);
                return p && Number(p.PointValue) >= 17;
            }).length;
            if (highValueCount >= 2) {
                alert('You can only have 2 Pokémon worth 17 or more points on your team.');
                setShowPanel(false);
                return;
            }
        }

        if (Number(userTeam.Points) - Number(props.value) < 0) {
            alert("You don't have enough points to purchase this Pokemon.");
            setShowPanel(false);
            return;
        }

        const purchaseRes = await fetch('/api/teammates/create', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ team_id: userTeam.id, pokemon: props.name })
        });
        const result = await purchaseRes.json();

        if (purchaseRes.ok) {
            await fetch('/api/team/updatepoints', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, points: Number(userTeam.Points) - Number(props.value) })
            });
            await fetch('/api/pokemon/claim', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, pokemonName: props.name })
            });
            await fetch('/api/team/updatetrades', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, trades: Number(userTeam.trades) - 1 })
            });
            await fetch('/api/tradelog/create', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, team_name: userTeam.TeamName, action: 'BUY', pokemon_or_item: props.name, points: props.value })
            });
            setOwnedBy(username);
            alert(`${props.name} purchased successfully! Trades remaining: ${Number(userTeam.trades) - 1}`);
        } else {
            alert('Something went wrong with the purchase.');
            console.error(result);
        }

        setShowPanel(false);
    }

    // Derive types and abilities from fetched data
    const types: string[] = pokeStats?.types?.map((t: any) => {
        const n = t.type.name as string;
        return n.charAt(0).toUpperCase() + n.slice(1);
    }) ?? [];

    return (
        <>
            {/* ── CARD ── */}
            <div
                onClick={handleCardClick}
                style={{ cursor: ownedBy ? 'default' : 'pointer', textAlign: 'center', padding: '4px', borderRadius: '8px', border: '1px solid transparent', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(227,209,9,0.25)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
            >
                <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.image}.png`}
                    alt={props.name}
                    style={{ filter: ownedBy ? 'grayscale(100%)' : 'none', opacity: ownedBy ? 0.5 : 1, alignItems: 'center' }}
                />
                <div style={{ fontSize: '0.8rem', textAlign: 'center', fontWeight: 'bold' }}>{props.name}</div>
                <div style={{ fontSize: '0.75rem', textAlign: 'center', color: ownedBy ? '#999' : 'inherit' }}>
                    {ownedBy ? `Owned by ${ownedBy}` : `${props.value} pts`}
                </div>
            </div>

            {/* ── BACKDROP ── */}
            {showPanel && <Backdrop onClick={() => setShowPanel(false)} />}

            {/* ── SIDE PANEL ── */}
            <SidePanel show={showPanel} onClose={() => setShowPanel(false)}>
                <PanelHeader
                    title={props.name}
                    subtitle={ownedBy ? `Owned by ${ownedBy}` : `${props.value} pts`}
                    imgSrc={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.image}.png`}
                    onClose={() => setShowPanel(false)}
                />

                <div style={{ padding: '20px', flex: 1 }}>
                    {!pokeStats ? (
                        <div style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Loading…</div>
                    ) : (
                        <>
                            {/* Abilities */}
                            <InfoBox label="Abilities — click for description">
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {pokeStats.abilities.map((a: any) => (
                                        <AbilityBadge
                                            key={a.ability.name}
                                            name={a.ability.name.replace(/-/g, ' ')}
                                        />
                                    ))}
                                </div>
                            </InfoBox>

                            {/* Types */}
                            <InfoBox label="Types — click for matchups">
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {types.map(t => <TypeBadge key={t} type={t} allTypes={types} />)}
                                </div>
                            </InfoBox>

                            {/* Base Stats */}
                            <InfoBox label="Base Stats">
                                {pokeStats.stats.map((s: any) => (
                                    <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
                                ))}
                            </InfoBox>

                            {/* Buy button — only show if not owned and trading is allowed */}
                            {!ownedBy && props.tradingAllowed && (
                                <Button
                                    variant="success"
                                    style={{ width: '100%', fontWeight: 'bold' }}
                                    onClick={handlePurchase}
                                >
                                    Buy for {props.value} pts
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </SidePanel>
        </>
    );
}