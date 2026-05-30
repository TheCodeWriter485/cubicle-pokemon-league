'use client'
import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Box from 'react-bootstrap/Card';

export default function Card(props: { name: string, value: number, image: number, ownedByOverride?: string | null }) {
    const [showPurchase, setShowPurchase] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [pokeStats, setPokeStats] = useState<any>(null);
    const [ownedBy, setOwnedBy] = useState<string | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Sync ownedBy with the override from parent whenever it changes
    useEffect(() => {
        if (props.ownedByOverride !== undefined) {
            setOwnedBy(props.ownedByOverride ?? null);
        }
    }, [props.ownedByOverride]);

    const handlePurchaseClose = () => setShowPurchase(false);
    const handlePurchaseShow = () => {
        if (!ownedBy) {
            setShowPurchase(true);
            fetchPokeData();
        }
    };

    useEffect(() => {
        checkLogin();
        // Only do individual ownership fetch if no override is provided
        if (props.ownedByOverride === undefined) {
            checkOwnership();
        }
    }, [])

    async function checkLogin() {
        const response = await fetch("http://localhost:3030/auth/status", {
            credentials: "include"
        });
        const data = await response.json();
        setLoggedIn(data.loggedin);
        setUsername(data.username);
    }

    async function checkOwnership() {
        try {
            const res = await fetch(`http://localhost:3030/pokemon/ownership/${props.name}`);
            const data = await res.json();
            setOwnedBy(data.OwnedBy ?? null);
        } catch (err) {
            console.warn("Could not fetch ownership data:", err);
        }
    }

    async function fetchPokeData() {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${props.image}`);
        const data = await response.json();
        setPokeStats(data);
    }

    async function handlePurchase() {
        if (!loggedIn) {
            alert("You must be logged in to purchase a Pokemon.");
            return;
        }

        if (ownedBy !== null) {
            alert(`${props.name} is already owned by ${ownedBy}.`);
            handlePurchaseClose();
            return;
        }

        const response = await fetch("http://localhost:3030/team");
        const teams = await response.json();
        const userTeam = teams.find((team: any) => team.Username === username);

        if (!userTeam) {
            alert("No team found for your account.");
            return;
        }

        const membersRes = await fetch("http://localhost:3030/team/full");
        const fullTeams = await membersRes.json();
        const userFullTeam = fullTeams.find((team: any) => team.Username === username);

        if (userFullTeam && userFullTeam.members.length >= 10) {
            alert("You already have 10 Pokémon on your team and cannot purchase more.");
            handlePurchaseClose();
            return;
        }

        if (Number(userTeam.Points) - Number(props.value) < 0) {
            alert("You don't have enough points to purchase this Pokemon.");
            handlePurchaseClose();
            return;
        }

        const purchaseResponse = await fetch("http://localhost:3030/teammates/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                team_id: userTeam.id,
                pokemon: props.name
            })
        });

        const result = await purchaseResponse.json();

        if (purchaseResponse.ok) {
            await fetch("http://localhost:3030/team/updatepoints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    points: Number(userTeam.Points) - Number(props.value)
                })
            });

            await fetch("http://localhost:3030/pokemon/claim", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    pokemonName: props.name
                })
            });

            setOwnedBy(username);
            alert(`${props.name} purchased successfully!`);
        } else {
            alert("Something went wrong with the purchase.");
            console.error(result);
        }

        handlePurchaseClose();
    }

    return (
        <div ref={cardRef} onClick={handlePurchaseShow} style={{ cursor: ownedBy ? 'default' : 'pointer' }}>
            <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.image}.png`}
                alt={props.name}
                loading="lazy"
                style={{
                    width: '96px',
                    height: '96px',
                    objectFit: 'contain',
                    filter: ownedBy ? 'grayscale(100%)' : 'none',
                    opacity: ownedBy ? 0.5 : 1
                }}
            />
            <div style={{ fontSize: '0.8rem', textAlign: 'center', fontWeight: 'bold' }}>{props.name}</div>
            <div style={{ fontSize: '0.75rem', textAlign: 'center', color: ownedBy ? '#999' : 'inherit' }}>
                {ownedBy ? `Owned by ${ownedBy}` : `${props.value} pts`}
            </div>

            <Overlay target={cardRef.current} show={showPurchase} placement="top" rootClose onHide={handlePurchaseClose}>
                <Popover style={{ backgroundColor: '#000000', border: '1px solid #e3d109', maxWidth: '300px', zIndex: 9999 }}>
                    <Popover.Header as="h3" className="text-center" style={{ color: 'white', backgroundColor: '#111' }}>
                        {props.name}
                    </Popover.Header>
                    <Popover.Body className="text-center" style={{ color: 'white' }}>
                        <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.image}.png`}
                            alt={props.name}
                            style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                        />
        <Box style={{ width: '18rem' }}>
        <Box.Img
            variant="top"
            src={`/sprites/sprites/pokemon/${props.image}.png`}
            loading="lazy"
            style={{ filter: ownedBy ? 'grayscale(100%)' : 'none', opacity: ownedBy ? 0.5 : 1 }}
        />
            <Box.Body>
                <Button variant="primary" style={{ marginRight: '8px' }} onClick={handleShow}>{props.name}</Button>

                {/* Buy button disabled if pokemon is already owned */}
                <Button
                    ref={buyButtonRef}
                    variant={ownedBy ? "secondary" : "success"}
                    onClick={handlePurchaseShow}
                    disabled={!!ownedBy}
                    title={ownedBy ? `Owned by ${ownedBy}` : "Buy this Pokémon"}
                >
                    {ownedBy ? `Owned by ${ownedBy}` : "Buy"}
                </Button>
            </Box.Body>

            <Overlay target={buyButtonRef.current} show={showPurchase} placement="top" rootClose onHide={handlePurchaseClose}>
                <Popover style={{ backgroundColor: '#000000', border: '1px solid #e3d109', maxWidth: '300px', zIndex: 9999 }}>
                    <Popover.Header as="h3" className="text-center">Purchase {props.name}?</Popover.Header>
                    <Popover.Body className="text-center">
                        <img
                            src={`/sprites/sprites/pokemon/${props.image}.png`}
                            alt={props.name}
                            style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                        />
                        <p><strong>Price:</strong> {props.value} points</p>

                        {pokeStats ? (
                            <>
                                <hr style={{ borderColor: '#e3d109' }} />
                                <p><strong>Abilities:</strong> {pokeStats.abilities.map((a: any) => a.ability.name).join(', ')}</p>
                                <hr style={{ borderColor: '#e3d109' }} />
                                <div style={{ textAlign: 'left' }}>
                                    <strong>Stats:</strong>
                                    {pokeStats.stats.map((s: any) => (
                                        <div key={s.stat.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ textTransform: 'capitalize' }}>{s.stat.name}:</span>
                                            <span>{s.base_stat}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}

                        <hr style={{ borderColor: '#e3d109' }} />
                        <div className="d-flex justify-content-center gap-2">
                            <Button variant="success" size="sm" onClick={handlePurchase}>Buy</Button><br></br>
                            <Button variant="secondary" size="sm" onClick={handlePurchaseClose}>Cancel</Button>
                        </div>
                    </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    );
}