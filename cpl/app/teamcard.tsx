'use client'
import { useState, useEffect, useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';

// Pokemon Team Card
export function PokemonTeamCard(props: { name: string, isOwner?: boolean, teamId?: number, username?: string }) {
    const [pokeData, setPokeData] = useState<any>(null);
    const [dbData, setDbData] = useState<any>(null);
    const [show, setShow] = useState(false);
    const [showSell, setShowSell] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${props.name.toLowerCase()}`);
                const pokeJson = await pokeRes.json();
                setPokeData(pokeJson);

                const dbRes = await fetch(`http://localhost:3030/pokedata`);
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
            // Remove from teammembers
            await fetch("http://localhost:3030/teammembers/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    team_id: props.teamId,
                    pokemon: props.name
                })
            });

            // Refund points
            const teamRes = await fetch("http://localhost:3030/team");
            const teams = await teamRes.json();
            const userTeam = teams.find((t: any) => t.Username === props.username);

            await fetch("http://localhost:3030/team/updatepoints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: props.username,
                    points: Number(userTeam.Points) + Number(dbData.PointValue)
                })
            });

            // Clear OwnedBy
            await fetch("http://localhost:3030/pokemon/claim", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: null,
                    pokemonName: props.name
                })
            });

            alert(`${props.name} sold successfully!`);
            setShowSell(false);
            window.location.reload();
        } catch (err) {
            console.error("Error selling pokemon:", err);
            alert("Something went wrong while selling.");
        }
    }

    return (
        <div
            ref={ref}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => { setShow(false); }}
            onClick={() => { if (props.isOwner) { setShow(false); setShowSell(true); } }}
            style={{ display: 'inline-block', textAlign: 'center', cursor: props.isOwner ? 'pointer' : 'default', margin: '4px' }}
        >
            {pokeData && (
                <img
                    src={`/sprites/sprites/pokemon/${pokeData.id}.png`}
                    alt={props.name}
                    style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                    loading="lazy"
                />
            )}
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{props.name}</div>

            {/* Hover info popover (non-owners) */}
            <Overlay target={ref.current} show={show && !showSell} placement="top">
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
                    </Popover.Body>
                </Popover>
            </Overlay>

            {/* Sell popover (owners only) */}
            <Overlay target={ref.current} show={showSell} placement="top" rootClose onHide={() => setShowSell(false)}>
                <Popover style={{ backgroundColor: '#000000', border: '1px solid #e3d109', maxWidth: '250px', zIndex: 9999 }}>
                    <Popover.Body className="text-center" style={{ color: 'white' }}>
                        <p>Do you wish to sell <strong>{props.name}</strong> for <strong>{dbData?.PointValue} points</strong>?</p>
                        <div className="d-flex justify-content-center gap-2">
                            <Button variant="success" size="sm" onClick={handleSell}>Yes</Button>
                            <Button variant="secondary" size="sm" onClick={() => setShowSell(false)}>No</Button>
                        </div>
                    </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    );
}

// Item Team Card
export function ItemTeamCard(props: { name: string, isOwner?: boolean, teamId?: number, username?: string }) {
    const [itemData, setItemData] = useState<any>(null);
    const [show, setShow] = useState(false);
    const [showSell, setShowSell] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`http://localhost:3030/itemshop`);
                const json = await res.json();
                const match = json.find((i: any) => i.item.toLowerCase() === props.name.toLowerCase());
                setItemData(match);
            } catch (err) {
                console.warn("Could not fetch item data:", err);
            }
        }
        fetchData();
    }, [props.name]);

    async function handleSell() {
        try {
            // Remove from teamitems
            await fetch("http://localhost:3030/teamitems/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    team_id: props.teamId,
                    item: props.name
                })
            });

            // Refund points
            const teamRes = await fetch("http://localhost:3030/team");
            const teams = await teamRes.json();
            const userTeam = teams.find((t: any) => t.Username === props.username);

            await fetch("http://localhost:3030/team/updatepoints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: props.username,
                    points: Number(userTeam.Points) + Number(itemData.points)
                })
            });

            alert(`${props.name} sold successfully!`);
            setShowSell(false);
            window.location.reload();
        } catch (err) {
            console.error("Error selling item:", err);
            alert("Something went wrong while selling.");
        }
    }

    return (
        <div
            ref={ref}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => { setShow(false); }}
            onClick={() => { if (props.isOwner) { setShow(false); setShowSell(true); } }}
            style={{ display: 'inline-block', textAlign: 'center', cursor: props.isOwner ? 'pointer' : 'default', margin: '4px' }}
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

            {/* Hover info popover (non-owners) */}
            <Overlay target={ref.current} show={show && !showSell} placement="top">
                <Popover style={{ backgroundColor: '#000000', border: '1px solid #e3d109', maxWidth: '250px', zIndex: 9999 }}>
                    <Popover.Header className="text-center" style={{ color: 'white', backgroundColor: '#111' }}>{props.name}</Popover.Header>
                    <Popover.Body style={{ color: 'white' }}>
                        {itemData ? (
                            <>
                                <p>{itemData.descr}</p>
                                <p><strong>Cost:</strong> {itemData.points} points</p>
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </Popover.Body>
                </Popover>
            </Overlay>

            {/* Sell popover (owners only) */}
            <Overlay target={ref.current} show={showSell} placement="top" rootClose onHide={() => setShowSell(false)}>
                <Popover style={{ backgroundColor: '#000000', border: '1px solid #e3d109', maxWidth: '250px', zIndex: 9999 }}>
                    <Popover.Body className="text-center" style={{ color: 'white' }}>
                        <p>Do you wish to sell <strong>{props.name}</strong> for <strong>{itemData?.points} points</strong>?</p>
                        <div className="d-flex justify-content-center gap-2">
                            <Button variant="success" size="sm" onClick={handleSell}>Yes</Button>
                            <Button variant="secondary" size="sm" onClick={() => setShowSell(false)}>No</Button>
                        </div>
                    </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    );
}