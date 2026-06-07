'use client'
import { useState, useEffect, useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';

const ITEM_TO_POKEMON: Record<string, string> = {
'Abomasite': 'abomasnow-mega',
    'Absolite': 'absol-mega',
    'Absolite Z': 'absol-mega',
    'Aerodactylite': 'aerodactyl-mega',
    'Aggronite': 'aggron-mega',
    'Alakazite': 'alakazam-mega',
    'Altarianite': 'altaria-mega',
    'Ampharosite': 'ampharos-mega',
    'Audinite': 'audino-mega',
    'Banettite': 'banette-mega',
    'Beedrillite': 'beedrill-mega',
    'Blastoisinite': 'blastoise-mega',
    'Blazikenite': 'blaziken-mega',
    'Cameruptite': 'camerupt-mega',
    'Charizardite X': 'charizard-mega-x',
    'Charizardite Y': 'charizard-mega-y',
    'Garchompite': 'garchomp-mega',
    'Garchompite Z': 'garchomp-mega',
    'Gardevoirite': 'gardevoir-mega',
    'Galladite': 'gallade-mega',
    'Gengarite': 'gengar-mega',
    'Glalitite': 'glalie-mega',
    'Gyaradosite': 'gyarados-mega',
    'Heracronite': 'heracross-mega',
    'Houndoominite': 'houndoom-mega',
    'Kangaskhanite': 'kangaskhan-mega',
    'Latiasite': 'latias-mega',
    'Latiosite': 'latios-mega',
    'Lopunnite': 'lopunny-mega',
    'Lucarionite': 'lucario-mega',
    'Lucarionite Z': 'lucario-mega',
    'Manectite': 'manectric-mega',
    'Mawilite': 'mawile-mega',
    'Medichamite': 'medicham-mega',
    'Metagrossite': 'metagross-mega',
    'Mewtwonite X': 'mewtwo-mega-x',
    'Mewtwonite Y': 'mewtwo-mega-y',
    'Pidgeotite': 'pidgeot-mega',
    'Pinsirite': 'pinsir-mega',
    'Sablenite': 'sableye-mega',
    'Salamencite': 'salamence-mega',
    'Scizorite': 'scizor-mega',
    'Sceptilite': 'sceptile-mega',
    'Sharpedonite': 'sharpedo-mega',
    'Slowbronite': 'slowbro-mega',
    'Steelixite': 'steelix-mega',
    'Swampertite': 'swampert-mega',
    'Tyranitarite': 'tyranitar-mega',
    'Venusaurite': 'venusaur-mega',
    'Diancite': 'diancie-mega',
    'Attackorite': 'deoxys-attack',
    'Defendorite': 'deoxys-defense',
    'Speedorite': 'deoxys-speed',
    'Fan': 'rotom-fan',
    'Lawmower': 'rotom-mow',
    'Microwave': 'rotom-heat',
    'Refridgator': 'rotom-frost',
    'Washing Machine': 'rotom-wash',
    'Gracidea': 'shaymin-sky',
    'Prison Bottle': 'hoopa-unbound',
    'Reveal Glass': 'thundurus-therian',
    'Cornerstone Mask': 'ogerpon-cornerstone-mask',
    'Hearthflame Mask': 'ogerpon-hearthflame-mask',
    'Wellspring Mask': 'ogerpon-wellspring-mask',
    'Zygarde Core': 'zygarde-complete',
};

// Pokemon Team Card
export function PokemonTeamCard(props: { name: string, isOwner?: boolean, teamId?: number, username?: string }) {
    const [pokeData, setPokeData] = useState<any>(null);
    const [dbData, setDbData] = useState<any>(null);
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${props.name.toLowerCase()}`);
                const pokeJson = await pokeRes.json();
                setPokeData(pokeJson);

                const dbRes = await fetch(`http://129.80.79.84:3030/pokedata`);
                const dbJson = await dbRes.json();
                const match = dbJson.find((p: any) => p.NamePoke.toLowerCase() === props.name.toLowerCase());
                setDbData(match);
            } catch (err) {
                console.warn("Could not fetch pokemon data:", err);
            }
        }
        fetchData();
    }, [props.name]);

    async function handleSell() {
        try {
            await fetch("http://129.80.79.84:3030/teammembers/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ team_id: props.teamId, pokemon: props.name })
            });

            const teamRes = await fetch("http://129.80.79.84:3030/team");
            const teams = await teamRes.json();
            const userTeam = teams.find((t: any) => t.Username === props.username);

            await fetch("http://129.80.79.84:3030/team/updatepoints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: props.username,
                    points: Number(userTeam.Points) + Number(dbData.PointValue)
                })
            });

            await fetch("http://129.80.79.84:3030/pokemon/claim", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: null, pokemonName: props.name })
            });

            await fetch("http://129.80.79.84:3030/tradelog/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        username: props.username,
        team_name: userTeam.TeamName,
        action: "SELL",
        pokemon_or_item: props.name,
        points: dbData.PointValue
    })
});

            alert(`${props.name} sold successfully!`);
            setShow(false);
            window.location.reload();
        } catch (err) {
            console.error("Error selling pokemon:", err);
            alert("Something went wrong while selling.");
        }
    }

    return (
        <div
            ref={ref}
            onClick={() => setShow(!show)}
            style={{ display: 'inline-block', textAlign: 'center', cursor: 'pointer', margin: '4px' }}
        >
            {pokeData && (
                <img
                    src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + pokeData.id + ".png"}
                    style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                    loading="lazy"
                />
            )}
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{props.name}</div>

            <Overlay target={ref.current} show={show} placement="top" rootClose onHide={() => setShow(false)}>
                <Popover style={{ backgroundColor: '#000000', border: '1px solid #e3d109', maxWidth: '250px', zIndex: 9999 }}>
                    <Popover.Header className="text-center" style={{ color: 'white', backgroundColor: '#111' }}>{props.name}</Popover.Header>
                    <Popover.Body style={{ color: 'white' }}>
                        {pokeData ? (
                            <>
                                <p><strong>Abilities:</strong> {pokeData.abilities.map((a: any) => a.ability.name).join(', ')}</p>
                                <hr style={{ borderColor: '#e3d109' }} />
                                <div>
                                    <strong>Base Stats:</strong>
                                    {pokeData.stats.map((s: any) => (
                                        <div key={s.stat.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ textTransform: 'capitalize' }}>{s.stat.name}:</span>
                                            <span>{s.base_stat}</span>
                                        </div>
                                    ))}
                                </div>
                                {dbData && (
                                    <>
                                        <hr style={{ borderColor: '#e3d109' }} />
                                        <strong>League Stats:</strong>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Point Value:</span><span>{dbData.PointValue}</span></div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Score:</span><span>{dbData.Score}</span></div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Diff:</span><span>{dbData.Diff}</span></div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Kills:</span><span>{dbData.Kills}</span></div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Deaths:</span><span>{dbData.Death}</span></div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Wins:</span><span>{dbData.Wins}</span></div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Games Played:</span><span>{dbData.GamesPlayed}</span></div>
                                    </>
                                )}
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}

                        {props.isOwner && dbData && (
                            <>
                                <hr style={{ borderColor: '#e3d109' }} />
                                <div className="d-flex justify-content-center">
                                    <Button variant="danger" size="sm" onClick={handleSell}>
                                        Sell for {dbData.PointValue} pts
                                    </Button>
                                </div>
                            </>
                        )}
                    </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    );
}

// Item Team Card
export function ItemTeamCard(props: { name: string, isOwner?: boolean, teamId?: number, username?: string }) {
    const [itemData, setItemData] = useState<any>(null);
    const [transformStats, setTransformStats] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`http://129.80.79.84:3030/itemshop`);
                const json = await res.json();
                const match = json.find((i: any) => i.item.toLowerCase() === props.name.toLowerCase());
                setItemData(match);
            } catch (err) {
                console.warn("Could not fetch item data:", err);
            }
        }
        fetchData();
    }, [props.name]);

    async function fetchTransformStats() {
        const slug = ITEM_TO_POKEMON[props.name];
        if (!slug || transformStats) return;
        setLoadingStats(true);
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`);
            const data = await res.json();
            setTransformStats(data);
        } catch (err) {
            console.warn("Could not fetch transform stats:", err);
        } finally {
            setLoadingStats(false);
        }
    }

    const handleClick = () => {
        setShow(!show);
        if (!show) fetchTransformStats();
    };

    async function handleSell() {
        try {
            await fetch("http://129.80.79.84:3030/teamitems/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ team_id: props.teamId, item: props.name })
            });

            const teamRes = await fetch("http://129.80.79.84:3030/team");
            const teams = await teamRes.json();
            const userTeam = teams.find((t: any) => t.Username === props.username);

            await fetch("http://129.80.79.84:3030/team/updatepoints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: props.username,
                    points: Number(userTeam.Points) + Number(itemData.points)
                })
            });

            await fetch("http://129.80.79.84:3030/tradelog/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        username: props.username,
        team_name: userTeam.TeamName,
        action: "SELL",
        pokemon_or_item: props.name,
        points: itemData.points
    })
});

            alert(`${props.name} sold successfully!`);
            setShow(false);
            window.location.reload();
        } catch (err) {
            console.error("Error selling item:", err);
            alert("Something went wrong while selling.");
        }
    }

    const hasTransform = !!ITEM_TO_POKEMON[props.name];

    return (
        <div
            ref={ref}
            onClick={handleClick}
            style={{ display: 'inline-block', textAlign: 'center', cursor: 'pointer', margin: '4px' }}
        >
            {itemData && (
                <img
                    src={`/img/${itemData.id}.png`}
                    alt={props.name}
                    style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                    loading="lazy"
                />
            )}
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{props.name}</div>

            <Overlay target={ref.current} show={show} placement="top" rootClose onHide={() => setShow(false)}>
                <Popover style={{ backgroundColor: '#000000', border: '1px solid #e3d109', maxWidth: '280px', zIndex: 9999 }}>
                    <Popover.Header className="text-center" style={{ color: 'white', backgroundColor: '#111' }}>{props.name}</Popover.Header>
                    <Popover.Body style={{ color: 'white' }}>
                        {itemData ? (
                            <>
                                <p>{itemData.descr}</p>
                                <p><strong>Cost:</strong> {itemData.points} points</p>

                                {/* Transform Stats */}
                                {hasTransform && (
                                    <>
                                        <hr style={{ borderColor: '#e3d109' }} />
                                        {loadingStats ? (
                                            <p>Loading transform stats...</p>
                                        ) : transformStats ? (
                                            <>
                                                <img
                                                    src={transformStats.sprites?.front_default}
                                                    alt={transformStats.name}
                                                    style={{ width: '80px', height: '80px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                                                />
                                                <p style={{ textTransform: 'capitalize', fontWeight: 'bold', textAlign: 'center' }}>
                                                    {transformStats.name.replace(/-/g, ' ')}
                                                </p>
                                                <p style={{ fontSize: '0.85rem' }}>
                                                    <strong>Abilities:</strong> {transformStats.abilities.map((a: any) => a.ability.name).join(', ')}
                                                </p>
                                                <hr style={{ borderColor: '#e3d109' }} />
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <strong>Stats:</strong>
                                                    {transformStats.stats.map((s: any) => (
                                                        <div key={s.stat.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <span style={{ textTransform: 'capitalize' }}>{s.stat.name}:</span>
                                                            <span>{s.base_stat}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : null}
                                    </>
                                )}
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}

                        {props.isOwner && itemData && (
                            <>
                                <hr style={{ borderColor: '#e3d109' }} />
                                <div className="d-flex justify-content-center">
                                    <Button variant="danger" size="sm" onClick={handleSell}>
                                        Sell for {itemData.points} pts
                                    </Button>
                                </div>
                            </>
                        )}
                    </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    );
}