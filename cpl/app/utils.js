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

    let kills = {};
    let deaths = {};
    let pokemon_left = { "p1": 6, "p2": 6 };
    let pokemon_list = [];
    let p1_pokemon = [];
    let p2_pokemon = [];
    let player_names = { "p1": data.players[0], "p2": data.players[1] };
    let pokemon_teams = {};
    let alt_names = {};
    let winner = "";
    const logs = data.log.split('\n');
    for (let i = 0; i < logs.length; i++) {
        let line = logs[i];
        // GET POKEMON NAMES
        if (line.startsWith('|poke|')) {
            // Example line: |poke|p1|Rillaboom, F|
            let pokemon_name = line.split('|')[3].split(',')[0];
            pokemon_teams[pokemon_name] = line.split('|')[2];
            pokemon_list.push(pokemon_name);
            if (line.split('|')[2] === "p1") {
                p1_pokemon.push(pokemon_name);
            } else if (line.split('|')[2] === "p2") {
                p2_pokemon.push(pokemon_name);
            }
        }
        // GET ALTERNATE NAMES
        else if (line.startsWith('|switch|')) {
            // Example line: |switch|p1a: Rillaboom|Rillaboom, F|100/100
            let parts = line.split('|');
            let alt_name = parts[2].split(': ')[1];
            let official_name = parts[3].split(',')[0];
            if (!(alt_name in alt_names)) {
                alt_names[alt_name] = official_name;
            }
        }
        // TRACK K/D
        /*
            For Kills:
            What we do for this is look for the |move| lines and find the 
            |-damage| afterwards and if it has a fnt then we can count this as a kill.
            We look for |-damage| until we hit another |...| or | line that isn't |-...| or |faint|
        */
        else if (line.startsWith('|move|')) {
            let mover_alt_name = line.split('|')[2].split(': ')[1];
            let mover_official_name = alt_names[mover_alt_name];
            let j = i + 1;
            while (j < logs.length) {
                let next_line = logs[j];
                if (next_line.startsWith('|-damage|')) {
                    if (next_line.includes('fnt')) {
                        // Get pokemon fainting team and make sure it is not team of mover
                        let fainting_team = next_line.split('|')[2].split(': ')[0].substring(0, 2);
                        if (fainting_team !== pokemon_teams[mover_official_name]) {
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
            console.log(alt_names)
            let fainted_alt_name = line.split('|')[2].split(': ')[1];
            console.log(fainted_alt_name)
            let fainted_official_name = alt_names[fainted_alt_name];
            console.log(fainted_official_name)
            deaths[fainted_official_name] = (deaths[fainted_official_name] || 0) + 1;
            pokemon_left[pokemon_teams[fainted_official_name]] -= 1;
        }
        // GET WINNER
        else if (line.startsWith('|win|')) {
            // Example line: |win|Ash|
            let parts = line.split('|');
            winner = parts[2];
        }
        // GO THROUGH POKEMON LIST AND ENSURE KILLS/DEATHS ARE RECORDED
        for (let i = 0; i < pokemon_list.length; i++) {
            let pname = pokemon_list[i];
            if (!(pname in kills)) {
                kills[pname] = 0;
            }
            if (!(pname in deaths)) {
                deaths[pname] = 0;
            }
        }
    }
    const output = {
        match_id: data.id,
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