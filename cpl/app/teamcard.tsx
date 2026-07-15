'use client'
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

// ── LOOKUP TABLES ─────────────────────────────────────────────────────────────

const ITEM_TO_POKEMON: Record<string, string> = {
    'Abomasite': 'abomasnow-mega', 'Absolite': 'absol-mega', 'Absolite Z': 'absol-mega-z',
    'Aerodactylite': 'aerodactyl-mega', 'Aggronite': 'aggron-mega', 'Alakazite': 'alakazam-mega',
    'Altarianite': 'altaria-mega', 'Ampharosite': 'ampharos-mega', 'Audinite': 'audino-mega',
    'Banettite': 'banette-mega', 'Beedrillite': 'beedrill-mega', 'Blastoisinite': 'blastoise-mega',
    'Blazikenite': 'blaziken-mega', 'Cameruptite': 'camerupt-mega',
    'Charizardite X': 'charizard-mega-x', 'Charizardite Y': 'charizard-mega-y',
    'Garchompite': 'garchomp-mega', 'Garchompite Z': 'garchomp-mega-z',
    'Gardevoirite': 'gardevoir-mega', 'Galladite': 'gallade-mega', 'Gengarite': 'gengar-mega',
    'Glalitite': 'glalie-mega', 'Gyaradosite': 'gyarados-mega', 'Heracronite': 'heracross-mega',
    'Houndoominite': 'houndoom-mega', 'Kangaskhanite': 'kangaskhan-mega',
    'Latiasite': 'latias-mega', 'Latiosite': 'latios-mega', 'Lopunnite': 'lopunny-mega',
    'Lucarionite': 'lucario-mega', 'Lucarionite Z': 'lucario-mega-z',
    'Manectite': 'manectric-mega', 'Mawilite': 'mawile-mega', 'Medichamite': 'medicham-mega',
    'Metagrossite': 'metagross-mega', 'Mewtwonite X': 'mewtwo-mega-x', 'Mewtwonite Y': 'mewtwo-mega-y',
    'Pidgeotite': 'pidgeot-mega', 'Pinsirite': 'pinsir-mega', 'Sablenite': 'sableye-mega',
    'Salamencite': 'salamence-mega', 'Scizorite': 'scizor-mega', 'Sceptilite': 'sceptile-mega',
    'Sharpedonite': 'sharpedo-mega', 'Slowbronite': 'slowbro-mega', 'Steelixite': 'steelix-mega',
    'Swampertite': 'swampert-mega', 'Tyranitarite': 'tyranitar-mega', 'Venusaurite': 'venusaur-mega',
    'Clefablite': 'clefable-mega', 'Victreebelite': 'victreebel-mega', 'Starminite': 'starmie-mega',
    'Dragoninite': 'dragonite-mega', 'Meganiumite': 'meganium-mega', 'Feraligite': 'feraligatr-mega',
    'Skarmorite': 'skarmory-mega', 'Froslassite': 'froslass-mega', 'Heatranite': 'heatran-mega',
    'Darkranite': 'darkrai-mega', 'Emboarite': 'emboar-mega', 'Excadrite': 'excadrill-mega',
    'Scolipite': 'scolipede-mega', 'Scraftinite': 'scrafty-mega', 'Eelektrossite': 'eelektross-mega',
    'Chandelurite': 'chandelure-mega', 'Chesnaughtite': 'chesnaught-mega', 'Delphoxite': 'delphox-mega',
    'Greninjite': 'greninja-mega', 'Pyroarite': 'pyroar-mega', 'Floettite': 'floetteeternal-mega',
    'Malamarite': 'malamar-mega', 'Barbaracite': 'barbaracle-mega', 'Dragalgite': 'dragalge-mega',
    'Hawluchanite': 'hawlucha-mega', 'Zygardite': 'zygardecomplete-mega', 'Drampanite': 'drampa-mega',
    'Zeraorite': 'zeraora-mega', 'Falinksite': 'falinks-mega',
    'Raichunite X': 'raichu-mega-x', 'Raichunite Y': 'raichu-mega-y',
    'Chimechite': 'chimecho-mega', 'Staraptite': 'staraptor-mega', 'Golurkite': 'golurk-mega',
    'Meowsticite': 'meowstic-mega', 'Crabominite': 'crabominable-mega', 'Golisopite': 'golisopod-mega',
    'Magearnite': 'magearna-mega', 'Scovillainite': 'scovillain-mega', 'Baxcalibrite': 'baxcalibur-mega',
    'Tatsugirinite': 'tatsugiri-mega', 'Glimmoranite': 'glimmora-mega', 'Diancite': 'diancie-mega',
    'Attackorite': 'deoxys-attack', 'Defendorite': 'deoxys-defense', 'Speedorite': 'deoxys-speed',
    'Fan': 'rotom-fan', 'Lawmower': 'rotom-mow', 'Microwave': 'rotom-heat',
    'Refridgator': 'rotom-frost', 'Washing Machine': 'rotom-wash', 'Gracidea': 'shaymin-sky',
    'Prison Bottle': 'hoopa-unbound', 'Reveal Glass': 'thundurus-therian',
    'Cornerstone Mask': 'ogerpon-cornerstone-mask', 'Hearthflame Mask': 'ogerpon-hearthflame-mask',
    'Wellspring Mask': 'ogerpon-wellspring-mask', 'Zygarde Core': 'zygarde-complete',
};

const CUSTOM_ABILITIES: Record<string, string[]> = {
    'Absolite Z': ['Technician'], 'Garchompite Z': ['Rough Skin'],
    'Lucarionite Z': ["Mind's Eye"], 'Golisopite': ['Regenerator'],
    'Tatsugirinite': ['Drizzle'], 'Baxcalibrite': ['Thermal Exchange'],
};

const CUSTOM_TYPES: Record<string, string[]> = {
    'Absolite Z': ['Dark'], 'Garchompite Z': ['Dragon', 'Ground'],
    'Lucarionite Z': ['Fighting', 'Steel'], 'Golisopite': ['Bug', 'Water'],
    'Tatsugirinite': ['Dragon', 'Water'], 'Baxcalibrite': ['Dragon', 'Ice'],
};

const statColors: Record<string, string> = {
    'hp': '#ff5959', 'attack': '#f5ac78', 'defense': '#fae078',
    'special-attack': '#9db7f5', 'special-defense': '#a7db8d', 'speed': '#fa92b2',
};

// ── TYPE CHART (defensive matchups) ──────────────────────────────────────────
// For each attacking type: which defender types make it super-effective (weak),
// not-very-effective (resist), or immune
const TYPE_CHART: Record<string, { weak: string[], resist: string[], immune: string[] }> = {
    Normal:   { weak: ['Fighting'],                                   resist: [],                                                                             immune: ['Ghost'] },
    Fire:     { weak: ['Water','Ground','Rock'],                      resist: ['Fire','Grass','Ice','Bug','Steel','Fairy'],                                    immune: ['Burn'] },
    Water:    { weak: ['Electric','Grass'],                           resist: ['Fire','Water','Ice','Steel'],                                                  immune: [] },
    Electric: { weak: ['Ground'],                                     resist: ['Electric','Flying','Steel'],                                                   immune: ['Paralysis'] },
    Grass:    { weak: ['Fire','Ice','Poison','Flying','Bug'],         resist: ['Water','Electric','Grass','Ground'],                                           immune: [] },
    Ice:      { weak: ['Fire','Fighting','Rock','Steel'],             resist: ['Ice'],                                                                         immune: ['Freeze'] },
    Fighting: { weak: ['Flying','Psychic','Fairy'],                   resist: ['Bug','Rock','Dark'],                                                           immune: [] },
    Poison:   { weak: ['Ground','Psychic'],                           resist: ['Grass','Fighting','Poison','Bug','Fairy'],                                     immune: ['Toxic','Toxic Spikes'] },
    Ground:   { weak: ['Water','Grass','Ice'],                        resist: ['Poison','Rock'],                                                               immune: ['Electric'] },
    Flying:   { weak: ['Electric','Ice','Rock'],                      resist: ['Grass','Fighting','Bug'],                                                      immune: ['Ground','Spikes','Toxic Spikes','Sticky Web'] },
    Psychic:  { weak: ['Bug','Ghost','Dark'],                         resist: ['Fighting','Psychic'],                                                          immune: [] },
    Bug:      { weak: ['Fire','Flying','Rock'],                       resist: ['Grass','Fighting','Ground'],                                                   immune: [] },
    Rock:     { weak: ['Water','Grass','Fighting','Ground','Steel'],  resist: ['Normal','Fire','Poison','Flying'],                                             immune: [] },
    Ghost:    { weak: ['Ghost','Dark'],                               resist: ['Poison','Bug'],                                                                immune: ['Normal','Fighting'] },
    Dragon:   { weak: ['Ice','Dragon','Fairy'],                       resist: ['Fire','Water','Electric','Grass'],                                             immune: [] },
    Dark:     { weak: ['Fighting','Bug','Fairy'],                     resist: ['Ghost','Dark'],                                                                immune: ['Psychic','Prankster'] },
    Steel:    { weak: ['Fire','Fighting','Ground'],                   resist: ['Normal','Grass','Ice','Flying','Psychic','Bug','Rock','Dragon','Steel','Fairy'], immune: ['Poison','Toxic','Toxic Spikes'] },
    Fairy:    { weak: ['Poison','Steel'],                             resist: ['Fighting','Bug','Dark'],                                                       immune: ['Dragon'] },
};

function calcTypeMatchup(types: string[]) {
    const ALL_TYPES = Object.keys(TYPE_CHART);

    const mult: Record<string, number> = {};
    for (const atk of ALL_TYPES) {
        mult[atk] = 1;
    }

    // New list for status/hazard/ability immunities
    const extraImmunities = new Set<string>();

    for (const defType of types) {
        const chart = TYPE_CHART[defType];
        if (!chart) continue;

        for (const atk of chart.weak)
            mult[atk] *= 2;

        for (const atk of chart.resist)
            mult[atk] *= 0.5;

        for (const immune of chart.immune) {
            if (ALL_TYPES.includes(immune)) {
                // Immune to an attacking type
                mult[immune] = 0;
            } else {
                // Immune to a status / hazard / ability
                extraImmunities.add(immune);
            }
        }
    }

    const weak: string[] = [];
    const resist: string[] = [];
    const immune: string[] = [];

    for (const atk of ALL_TYPES) {
        const m = mult[atk];

        if (m === 0)
            immune.push(atk);
        else if (m > 1)
            weak.push(atk);
        else if (m < 1)
            resist.push(atk);
    }

    // Append custom immunities
    immune.push(...Array.from(extraImmunities));

    return { weak, resist, immune };
}
// ── CENTRE MODAL ─────────────────────────────────────────────────────────────

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

// ── TYPE MATCHUP MODAL ───────────────────────────────────────────────────────

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

// ── ABILITY INFO MODAL ───────────────────────────────────────────────────────

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
            <p style={{ color: '#ccc', fontSize: '0.85rem', margin: 0, lineHeight: 1.55 }}>
                {desc ?? 'Loading…'}
            </p>
        </CentreModal>
    );
}

// ── CLICKABLE BADGES ─────────────────────────────────────────────────────────

function TypeBadge({ type, allTypes }: { type: string, allTypes: string[] }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <span onClick={e => { e.stopPropagation(); setOpen(true); }} style={{
                background: '#333', borderRadius: '4px', padding: '3px 10px',
                color: '#fff', fontSize: '0.78rem', textTransform: 'capitalize',
                cursor: 'pointer', border: '1px solid #555', transition: 'border-color 0.15s',
            }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#e3d109')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#555')}>
                {type}
            </span>
            {open && <TypeMatchupModal types={allTypes} onClose={() => setOpen(false)} />}
        </>
    );
}

function AbilityBadge({ name}: { name: string}) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <span onClick={e => { e.stopPropagation(); setOpen(true); }} style={{
                background: '#222', border: '1px solid #444', borderRadius: '4px',
                padding: '3px 8px', color: '#fff',
                fontSize: '0.78rem', textTransform: 'capitalize',
                fontStyle: 'normal',
                cursor: 'pointer', transition: 'border-color 0.15s',
            }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#e3d109')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#444')}>
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
                {imgSrc && <img src={imgSrc} alt={title} style={{ width: 52, height: 52, objectFit: 'contain' }} />}
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
                <span style={{ color: '#aaa', fontSize: '0.72rem', textTransform: 'capitalize' }}>{name.replace('-', ' ')}</span>
                <span style={{ color: '#fff', fontSize: '0.72rem', fontWeight: 'bold' }}>{value}</span>
            </div>
            <div style={{ background: '#2a2a2a', borderRadius: '3px', height: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.4s ease' }} />
            </div>
        </div>
    );
}

function LeagueStat({ label, value }: { label: string, value: any }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#aaa', fontSize: '0.78rem' }}>{label}</span>
            <span style={{ color: '#fff', fontSize: '0.78rem', fontWeight: 'bold' }}>{value}</span>
        </div>
    );
}

const cardStyle: React.CSSProperties = { display: 'inline-block', textAlign: 'center', cursor: 'pointer', margin: '4px', padding: '4px', borderRadius: '8px', border: '1px solid transparent', transition: 'transform 0.15s, box-shadow 0.15s' };
const onHover = (e: React.MouseEvent<HTMLDivElement>) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(227,209,9,0.25)'; };
const offHover = (e: React.MouseEvent<HTMLDivElement>) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; };

// ── POKEMON TEAM CARD ────────────────────────────────────────────────────────

export function PokemonTeamCard(props: { name: string, isOwner?: boolean, teamId?: number, username?: string }) {
    const [pokeData, setPokeData] = useState<any>(null);
    const [dbData, setDbData] = useState<any>(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${props.name.toLowerCase()}`);
                setPokeData(await pokeRes.json());
                const dbJson = await (await fetch('/api/pokedata')).json();
                setDbData(dbJson.find((p: any) => p.NamePoke.toLowerCase() === props.name.toLowerCase()));
            } catch (err) { console.warn('Could not fetch pokemon data:', err); }
        })();
    }, [props.name]);

    async function handleSell() {
        try {
            await fetch('/api/teammembers/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ team_id: props.teamId, pokemon: props.name }) });
            const teams = await (await fetch('/api/team')).json();
            const userTeam = teams.find((t: any) => t.Username === props.username);
            await fetch('/api/team/updatepoints', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: props.username, points: Number(userTeam.Points) + Number(dbData.PointValue) }) });
            await fetch('/api/pokemon/claim', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: null, pokemonName: props.name }) });
            await fetch('/api/tradelog/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: props.username, team_name: userTeam.TeamName, action: 'SELL', pokemon_or_item: props.name, points: dbData.PointValue }) });
            alert(`${props.name} sold successfully!`);
            setShow(false);
            window.location.reload();
        } catch (err) { console.error('Error selling pokemon:', err); alert('Something went wrong while selling.'); }
    }

    const spriteId = pokeData?.id;
    const types: string[] = pokeData?.types?.map((t: any) => {
        const n = t.type.name as string;
        return n.charAt(0).toUpperCase() + n.slice(1);
    }) ?? [];

    return (
        <>
            <div onClick={() => setShow(true)} style={cardStyle} onMouseEnter={onHover} onMouseLeave={offHover}>
                {pokeData && <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteId}.png`} alt={props.name} style={{ width: '64px', height: '64px', objectFit: 'contain' }} loading="lazy" />}
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff' }}>{props.name}</div>
                {dbData && <div style={{ fontSize: '0.7rem', color: '#e3d109' }}>{dbData.PointValue} pts</div>}
            </div>

            {show && <Backdrop onClick={() => setShow(false)} />}
            <SidePanel show={show} onClose={() => setShow(false)}>
                <PanelHeader
                    title={props.name}
                    subtitle={dbData ? `${dbData.PointValue} pts` : undefined}
                    imgSrc={spriteId ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteId}.png` : undefined}
                    onClose={() => setShow(false)}
                />
                <div style={{ padding: '20px', flex: 1 }}>
                    {!pokeData ? (
                        <div style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Loading…</div>
                    ) : (
                        <>
                            <InfoBox label="Abilities — click for description">
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {pokeData.abilities.map((a: any) => (
                                        <AbilityBadge key={a.ability.name} name={a.ability.name.replace(/-/g, ' ')} />
                                    ))}
                                </div>
                            </InfoBox>

                            <InfoBox label="Types — click for matchups">
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {types.map(t => <TypeBadge key={t} type={t} allTypes={types} />)}
                                </div>
                            </InfoBox>

                            <InfoBox label="Base Stats">
                                {pokeData.stats.map((s: any) => <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />)}
                            </InfoBox>

                            {dbData && (
                                <InfoBox label="League Stats">
                                    <LeagueStat label="Point Value" value={dbData.PointValue} />
                                    <LeagueStat label="Score" value={dbData.Score} />
                                    <LeagueStat label="Diff" value={dbData.Diff} />
                                    <LeagueStat label="Kills" value={dbData.Kills} />
                                    <LeagueStat label="Deaths" value={dbData.Death} />
                                    <LeagueStat label="Wins" value={dbData.Wins} />
                                    <LeagueStat label="Games Played" value={dbData.GamesPlayed} />
                                </InfoBox>
                            )}

                            {props.isOwner && dbData && (
                                <Button variant="danger" style={{ width: '100%', fontWeight: 'bold' }} onClick={handleSell}>
                                    Sell for {dbData.PointValue} pts
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </SidePanel>
        </>
    );
}

// ── ITEM TEAM CARD ───────────────────────────────────────────────────────────

export function ItemTeamCard(props: { name: string, isOwner?: boolean, teamId?: number, username?: string }) {
    const [itemData, setItemData] = useState<any>(null);
    const [transformStats, setTransformStats] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const json = await (await fetch('/api/itemshop')).json();
                setItemData(json.find((i: any) => i.item.toLowerCase() === props.name.toLowerCase()));
            } catch (err) { console.warn('Could not fetch item data:', err); }
        })();
    }, [props.name]);

    async function fetchTransformStats() {
        const slug = ITEM_TO_POKEMON[props.name];
        if (!slug || transformStats) return;
        setLoadingStats(true);
        try { setTransformStats(await (await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`)).json()); }
        catch (err) { console.warn('Could not fetch transform stats:', err); }
        finally { setLoadingStats(false); }
    }

    async function handleSell() {
        try {
            await fetch('/api/teamitems/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ team_id: props.teamId, item: props.name }) });
            const teams = await (await fetch('/api/team')).json();
            const userTeam = teams.find((t: any) => t.Username === props.username);
            await fetch('/api/team/updatepoints', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: props.username, points: Number(userTeam.Points) + Number(itemData.points) }) });
            await fetch('/api/tradelog/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: props.username, team_name: userTeam.TeamName, action: 'SELL', pokemon_or_item: props.name, points: itemData.points }) });
            alert(`${props.name} sold successfully!`);
            setShow(false);
            window.location.reload();
        } catch (err) { console.error('Error selling item:', err); alert('Something went wrong while selling.'); }
    }

    const hasTransform = !!ITEM_TO_POKEMON[props.name];

    const transformTypes: string[] = CUSTOM_TYPES[props.name]
        ? CUSTOM_TYPES[props.name]
        : transformStats?.types?.map((t: any) => {
            const n = t.type.name as string;
            return n.charAt(0).toUpperCase() + n.slice(1);
        }) ?? [];

    const transformAbilities: string[] = CUSTOM_ABILITIES[props.name]
        ? CUSTOM_ABILITIES[props.name]
        : transformStats?.abilities?.map((a: any) => (a.ability.name as string).replace(/-/g, ' ')) ?? [];

    return (
        <>
            <div onClick={() => { setShow(true); fetchTransformStats(); }} style={cardStyle} onMouseEnter={onHover} onMouseLeave={offHover}>
                {itemData && <img src={`/img/${itemData.id}.png`} alt={props.name} style={{ width: '64px', height: '64px', objectFit: 'contain' }} loading="lazy" />}
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff' }}>{props.name}</div>
                {itemData && <div style={{ fontSize: '0.7rem', color: '#e3d109' }}>{itemData.points} pts</div>}
            </div>

            {show && <Backdrop onClick={() => setShow(false)} />}
            <SidePanel show={show} onClose={() => setShow(false)}>
                <PanelHeader
                    title={props.name}
                    subtitle={itemData ? `${itemData.points} pts` : undefined}
                    imgSrc={itemData ? `/img/${itemData.id}.png` : undefined}
                    onClose={() => setShow(false)}
                />
                <div style={{ padding: '20px', flex: 1 }}>
                    {!itemData ? (
                        <div style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Loading…</div>
                    ) : (
                        <>
                            <InfoBox label="Description">
                                <p style={{ color: '#ccc', fontSize: '0.85rem', margin: 0 }}>{itemData.descr}</p>
                            </InfoBox>

                            {hasTransform && (
                                <InfoBox label="Transform Form">
                                    {loadingStats ? (
                                        <div style={{ color: '#888', fontSize: '0.85rem' }}>Loading…</div>
                                    ) : transformStats ? (
                                        <>
                                            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                                                <img src={transformStats.sprites?.front_default} alt={transformStats.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                                                <div style={{ color: '#fff', fontWeight: 'bold', textTransform: 'capitalize', fontSize: '0.85rem' }}>
                                                    {transformStats.name.replace(/-/g, ' ')}
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '10px' }}>
                                                <div style={{ color: '#aaa', fontSize: '0.72rem', marginBottom: '6px' }}>Types — click for matchups</div>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    {transformTypes.map(t => <TypeBadge key={t} type={t} allTypes={transformTypes} />)}
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '10px' }}>
                                                <div style={{ color: '#aaa', fontSize: '0.72rem', marginBottom: '6px' }}>Abilities — click for description</div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                    {transformAbilities.map(name => <AbilityBadge key={name} name={name} />)}
                                                </div>
                                            </div>

                                            <div style={{ color: '#aaa', fontSize: '0.72rem', marginBottom: '6px' }}>Base Stats</div>
                                            {transformStats.stats.map((s: any) => <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />)}
                                        </>
                                    ) : null}
                                </InfoBox>
                            )}

                            {props.isOwner && itemData && (
                                <Button variant="danger" style={{ width: '100%', fontWeight: 'bold' }} onClick={handleSell}>
                                    Sell for {itemData.points} pts
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </SidePanel>
        </>
    );
}