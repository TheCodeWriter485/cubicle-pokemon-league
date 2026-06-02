export function parseMatchData(data) {
    /*
    Method for parsing through match data logs and extracting the K/D for each Pokemon
    INPUTS:
    data: {
        log: string (entire battle log)
    }
    RETURNS:
    {
        pokemon_kills: {pokemon_name: kills, ...},
        pokemon_deaths: {pokemon_name: deaths, ...},
        winner: player_name,
        p1 : {
            name: player_name,
            pokemon: [pokemon_name, ...]
            diff: num,
            kills: num
            pokemon_left: num
            winner: bool
        },
        p2 : {
            name: player_name,
            pokemon: [pokemon_name, ...]
            diff: num,
            kills: num
            pokemon_left: num
            winner: bool
        },
    }
    */

    const kills = {};
    const deaths = {};
    const pokemon_left = { "p1": 6, "p2": 6 };
    const pokemon_list = [];
    const p1_pokemon = [];
    const p2_pokemon = [];
    const player_names = { "p1": data.players[0], "p2": data.players[1] };
    const pokemon_teams = {};
    const alt_names = {};
    let winner = "";

    const normalizeSlot = (slot) => slot?.split(': ')[0]?.substring(0, 2);
    const getNickname = (slot) => slot?.split(': ')[1];
    const getPokemonName = (details) => details?.split(',')[0];
    const rememberAlias = (slot, details) => {
        const nickname = getNickname(slot);
        const pokemon = getPokemonName(details);
        const team = normalizeSlot(slot);

        if (!pokemon || !team) return;

        pokemon_teams[pokemon] = team;
        alt_names[pokemon] = pokemon;

        if (nickname) {
            alt_names[nickname] = pokemon;
        }
    };
    const officialName = (name) => alt_names[name] || name;
    const ensurePokemonStats = (pokemon) => {
        if (!pokemon) return;
        if (!(pokemon in kills)) {
            kills[pokemon] = 0;
        }
        if (!(pokemon in deaths)) {
            deaths[pokemon] = 0;
        }
    };

    const logs = data.log.split('\n');
    for (let i = 0; i < logs.length; i++) {
        const line = logs[i];
        // GET POKEMON NAMES
        if (line.startsWith('|poke|')) {
            // Example line: |poke|p1|Rillaboom, F|
            const parts = line.split('|');
            const pokemon_name = getPokemonName(parts[3]);
            if (!pokemon_name) continue;
            pokemon_teams[pokemon_name] = parts[2];
            alt_names[pokemon_name] = pokemon_name;
            pokemon_list.push(pokemon_name);
            ensurePokemonStats(pokemon_name);
            if (parts[2] === "p1") {
                p1_pokemon.push(pokemon_name);
            } else if (parts[2] === "p2") {
                p2_pokemon.push(pokemon_name);
            }
        }
        // GET ALTERNATE NAMES
        else if (line.startsWith('|switch|') || line.startsWith('|drag|') || line.startsWith('|replace|')) {
            // Example line: |switch|p1a: Rillaboom|Rillaboom, F|100/100
            const parts = line.split('|');
            rememberAlias(parts[2], parts[3]);
        }
        // TRACK K/D
        /*
            For Kills:
            What we do for this is look for the |move| lines and find the 
            |-damage| afterwards and if it has a fnt then we can count this as a kill.
            We look for |-damage| until we hit another |...| or | line that isn't |-...| or |faint|
        */
        else if (line.startsWith('|move|')) {
            const mover_alt_name = getNickname(line.split('|')[2]);
            const mover_official_name = officialName(mover_alt_name);
            if (!mover_official_name) continue;
            let j = i + 1;
            while (j < logs.length) {
                const next_line = logs[j];
                if (next_line.startsWith('|-damage|')) {
                    if (next_line.includes('fnt')) {
                        // Get pokemon fainting team and make sure it is not team of mover
                        const fainting_team = normalizeSlot(next_line.split('|')[2]);
                        if (fainting_team !== pokemon_teams[mover_official_name]) {
                            ensurePokemonStats(mover_official_name);
                            kills[mover_official_name] = (kills[mover_official_name] || 0) + 1;
                        }
                    }
                }
                // check that next_line is not another |-...| or |faint|, if so break
                else if (!(next_line.startsWith('|-') || next_line.startsWith('|faint|') || next_line.startsWith('|debug|'))) {
                    break;
                }
                j++;
            }
        }
        /*
            For Deaths: we wait for the |faint| blocks to increment.
         */
        else if (line.startsWith('|faint|')) {
            const fainted_alt_name = getNickname(line.split('|')[2]);
            const fainted_official_name = officialName(fainted_alt_name);
            if (!fainted_official_name) continue;
            ensurePokemonStats(fainted_official_name);
            deaths[fainted_official_name] = (deaths[fainted_official_name] || 0) + 1;
            if (pokemon_teams[fainted_official_name]) {
                pokemon_left[pokemon_teams[fainted_official_name]] -= 1;
            }
        }
        // GET WINNER
        else if (line.startsWith('|win|')) {
            // Example line: |win|Ash|
            let parts = line.split('|');
            winner = parts[2];
        }
        // GO THROUGH POKEMON LIST AND ENSURE KILLS/DEATHS ARE RECORDED
        for (let j = 0; j < pokemon_list.length; j++) {
            ensurePokemonStats(pokemon_list[j]);
        }
    }
    const output = {
        id: data.id,
        pokemon_kills: kills,
        pokemon_deaths: deaths,
        winner: winner,
        p1: {
            name: player_names["p1"],
            pokemon: p1_pokemon,
            diff: pokemon_left["p1"] - pokemon_left["p2"],
            kills: 6 - pokemon_left["p2"],
            pokemon_left: pokemon_left["p1"],
            winner: (player_names["p1"] === winner)
        },
        p2: {
            name: player_names["p2"],
            pokemon: p2_pokemon,
            diff: pokemon_left["p2"] - pokemon_left["p1"],
            kills: 6 - pokemon_left["p1"],
            pokemon_left: pokemon_left["p2"],
            winner: (player_names["p2"] === winner)
        }
    };
    return output;
}
