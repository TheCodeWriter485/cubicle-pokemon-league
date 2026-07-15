'use client'
import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';

// Maps item name to PokeAPI pokemon slug
const ITEM_TO_POKEMON: Record<string, string> = {
    // Mega Stones
    'Abomasite': 'abomasnow-mega',
    'Absolite': 'absol-mega',
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
    'Clefablite': 'clefable-mega',
'Victreebelite': 'victreebel-mega',
'Starminite': 'starmie-mega',
'Dragoninite': 'dragonite-mega',
'Meganiumite': 'meganium-mega',
'Feraligite': 'feraligatr-mega',
'Skarmorite': 'skarmory-mega',
'Froslassite': 'froslass-mega',
'Heatranite': 'heatran-mega',
'Darkranite': 'darkrai-mega',
'Emboarite': 'emboar-mega',
'Excadrite': 'excadrill-mega',
'Scolipite': 'scolipede-mega',
'Scraftinite': 'scrafty-mega',
'Eelektrossite': 'eelektross-mega',
'Chandelurite': 'chandelure-mega',
'Chesnaughtite': 'chesnaught-mega',
'Delphoxite': 'delphox-mega',
'Greninjite': 'greninja-mega',
'Pyroarite': 'pyroar-mega',
'Floettite': 'floetteeternal-mega',
'Malamarite': 'malamar-mega',
'Barbaracite': 'barbaracle-mega',
'Dragalgite': 'dragalge-mega',
'Hawluchanite': 'hawlucha-mega',
'Zygardite': 'zygardecomplete-mega',
'Drampanite': 'drampa-mega',
'Zeraorite': 'zeraora-mega',
'Falinksite': 'falinks-mega',
'Raichunite X': 'raichu-mega-x',
'Raichunite Y': 'raichu-mega-y',
'Chimechite': 'chimecho-mega',
'Absolite Z': 'absol-mega-z',
'Staraptite': 'staraptor-mega',
'Garchompite Z': 'garchomp-mega-z',
'Lucarionite Z': 'lucario-mega-z',
'Golurkite': 'golurk-mega',
'Meowsticite': 'meowstic-mega',
'Crabominite': 'crabominable-mega',
'Golisopite': 'golisopod-mega',
'Magearnite': 'magearna-mega',
'Scovillainite': 'scovillain-mega',
'Baxcalibrite': 'baxcalibur-mega',
'Tatsugirinite': 'tatsugiri-mega',
'Glimmoranite': 'glimmora-mega',
'RaichuniteX': 'raichu-mega-x',
'RaichuniteY': 'raichu-mega-y',
'AbsoliteZ': 'absol-mega-z',
'GarchompiteZ': 'garchomp-mega-z',
'LucarioniteZ': 'lucario-mega-z',
    
    // Deoxys forms
    'Attackorite': 'deoxys-attack',
    'Defendorite': 'deoxys-defense',
    'Speedorite': 'deoxys-speed',
    // Rotom forms
    'Fan': 'rotom-fan',
    'Lawmower': 'rotom-mow',
    'Microwave': 'rotom-heat',
    'Refridgator': 'rotom-frost',
    'Washing Machine': 'rotom-wash',
    // Other forms
    'Gracidea': 'shaymin-sky',
    'Prison Bottle': 'hoopa-unbound',
    'Reveal Glass': 'thundurus-therian',
    'Cornerstone Mask': 'ogerpon-cornerstone-mask',
    'Hearthflame Mask': 'ogerpon-hearthflame-mask',
    'Wellspring Mask': 'ogerpon-wellspring-mask',
    'Zygarde Core': 'zygarde-complete',
};

export default function Item(props: { name: string, value: number, image: number, desc: string }) {
    const [showPurchase, setShowPurchase] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [pokeStats, setPokeStats] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handlePurchaseClose = () => setShowPurchase(false);
    const handlePurchaseShow = () => {
        setShowPurchase(true);
        fetchTransformStats();
    };

    useEffect(() => {
        checkLogin();
    }, [])

    async function checkLogin() {
        const response = await fetch("/api/auth/status", {
            credentials: "include"
        });
        const data = await response.json();
        setLoggedIn(data.loggedin);
        setUsername(data.username);
    }

    async function fetchTransformStats() {
        const pokemonSlug = ITEM_TO_POKEMON[props.name];
        if (!pokemonSlug) return;
        setLoadingStats(true);
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonSlug}`);
            const data = await res.json();
            setPokeStats(data);
            
        } catch (err) {
            console.warn("Could not fetch transform stats:", err);
        } finally {
            setLoadingStats(false);
        }
    }

    async function handlePurchase() {
        if (!loggedIn) {
            alert("You must be logged in to purchase items.");
            return;
        }

        const response = await fetch("/api/team");
        const teams = await response.json();
        const userTeam = teams.find((team: any) => team.Username === username);

        if (!userTeam) {
            alert("No team found for your account.");
            return;
        }

        if (userTeam.Points - props.value < 0) {
            alert("You don't have enough points to purchase this item.");
            handlePurchaseClose();
            return;
        }

        const purchaseResponse = await fetch("/api/teamitem/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ team_id: userTeam.id, item: props.name })
        });

        const result = await purchaseResponse.json();

if (purchaseResponse.ok) {
    await fetch("/api/team/updatepoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            points: userTeam.Points - props.value
        })
    });

    // Log the trade
    await fetch("/api/tradelog/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            team_name: userTeam.TeamName,
            action: "BUY",
            pokemon_or_item: props.name,
            points: props.value
        })
    });

    alert(`${props.name} purchased successfully!`);
} else {
            alert("Something went wrong with the purchase.");
            console.error(result);
        }

        handlePurchaseClose();
    }

    const hasTransform = !!ITEM_TO_POKEMON[props.name];

    return (
        <div
            ref={cardRef}
            onClick={handlePurchaseShow}
            style={{ cursor: 'pointer', textAlign: 'center', padding: '8px' }}
        >
            <img
                src={`/img/${props.image}.png`}
                alt={props.name}
                style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                loading="lazy"
            />
            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '4px' }}>{props.name}</div>
            <div style={{ fontSize: '0.75rem' }}>{props.value} pts</div>

            <Overlay target={cardRef.current} show={showPurchase} placement="top" rootClose onHide={handlePurchaseClose}>
                <Popover style={{ backgroundColor: '#000000', border: '1px solid #e3d109', maxWidth: '320px', zIndex: 9999 }}>
                    <Popover.Header as="h3" className="text-center" style={{ color: 'white', backgroundColor: '#111' }}>
                        {props.name}
                    </Popover.Header>
                    <Popover.Body className="text-center" style={{ color: 'white' }}>
                        <img
                            src={`/img/${props.image}.png`}
                            alt={props.name}
                            style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                        />
                        <p style={{ marginTop: '8px' }}>{props.desc}</p>
                        <p><strong>Price:</strong> {props.value} pts</p>

                        {/* Transform Stats */}
                        {hasTransform && (
                            <>
                                <hr style={{ borderColor: '#e3d109' }} />
                                {loadingStats ? (
                                    <p>Loading transform stats...</p>
                                ) : pokeStats ? (
                                    <>
                                        {/* Transform sprite */}
                                        <img
                                            src={pokeStats.sprites?.front_default}
                                            alt={pokeStats.name}
                                            style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                                        />
                                        <p style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                                            {pokeStats.name.replace(/-/g, ' ')}
                                        </p>
                                        <p style={{ fontSize: '0.85rem' }}>
                                            <strong>Abilities:</strong> {pokeStats.abilities.map((a: any) => a.ability.name).join(', ')}
                                        </p>
                                        <hr style={{ borderColor: '#e3d109' }} />
                                        <div style={{ textAlign: 'left', fontSize: '0.85rem' }}>
                                            <strong>Stats:</strong>
                                            {pokeStats.stats.map((s: any) => (
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

                        <hr style={{ borderColor: '#e3d109' }} />
                        <div className="d-flex justify-content-center gap-2">
                            <Button variant="success" size="sm" onClick={handlePurchase}>Buy</Button>

                        </div>
                    </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    );
}
