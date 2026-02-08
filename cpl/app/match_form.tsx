'use client'
import Form from 'next/form'
import { useState, useEffect } from 'react'
import { parseMatchData } from './utils';

export default function MatchForm() {
    const [round1, setRound1] = useState(null);
    const [round2, setRound2] = useState(null);
    const [round3, setRound3] = useState(null);
    const [match_data, setMatchData] = useState(null);
    const [showRound1, setShowRound1] = useState(false);
    const [showRound2, setShowRound2] = useState(false);
    const [showRound3, setShowRound3] = useState(false);

    useEffect(() => {
        // We will compile the match data here everytime the rounds are updated
        // Structure of match data will be:
        // {
        //     "match_ids": ["", "", ""],
        //     "round_data": [{}, {}, {}],
        //     "total_pokemon_kills": {},
        //     "total_pokemon_deaths": {},
        //     "match_winner": "Player 1"
        //     "p1": {
        //         name: "",
        //         round_wins: 0,
        //         winner: false
        //     }
        //     "p2": {
        //         name: "",
        //         round_wins: 0,
        //         winner: false
        //     }
        // }
        let match_ids = [];
        let round_data = [];
        let total_pokemon_kills_temp = [];
        let total_pokemon_deaths_temp = [];
        let match_winner = "";
        let p1 = {
            name: "",
            round_wins: 0,
            winner: false
        }
        let p2 = {
            name: "",
            round_wins: 0,
            winner: false
        }

        if (round1) {
            match_ids.push(round1.match_id);
            round_data.push(round1);
            total_pokemon_kills_temp.push(round1.pokemon_kills);
            total_pokemon_deaths_temp.push(round1.pokemon_deaths);
            if (p1.name === "") {
                p1.name = round1.p1.name;
                p2.name = round1.p2.name;
            }
            p1.round_wins += round1.p1.winner ? 1 : 0;
            p2.round_wins += round1.p2.winner ? 1 : 0;
        }

        if (round2) {
            match_ids.push(round2.match_id);
            round_data.push(round2);
            total_pokemon_kills_temp.push(round2.pokemon_kills);
            total_pokemon_deaths_temp.push(round2.pokemon_deaths);
            if (p1.name === "") {
                p1.name = round2.p1.name;
                p2.name = round2.p2.name;
            }
            p1.round_wins += round2.p1.winner ? 1 : 0;
            p2.round_wins += round2.p2.winner ? 1 : 0;
        }

        if (round3) {
            match_ids.push(round3.match_id);
            round_data.push(round3);
            total_pokemon_kills_temp.push(round3.pokemon_kills);
            total_pokemon_deaths_temp.push(round3.pokemon_deaths);
            if (p1.name === "") {
                p1.name = round3.p1.name;
                p2.name = round3.p2.name;
            }
            p1.round_wins += round3.p1.winner ? 1 : 0;
            p2.round_wins += round3.p2.winner ? 1 : 0;
        }

        if (p1.round_wins > p2.round_wins) {
            match_winner = p1.name;
            p1.winner = true;
        } else if (p2.round_wins > p1.round_wins) {
            match_winner = p2.name;
            p2.winner = true;
        }

        setMatchData({
            match_ids: match_ids,
            round_data: round_data,
            total_pokemon_kills: total_pokemon_kills_temp,
            total_pokemon_deaths: total_pokemon_deaths_temp,
            match_winner: match_winner,
            p1: p1,
            p2: p2
        });

    }, [round1, round2, round3]);

    const fetch_round_data = (url: string, round: number) => {
        url = url.split("?")[0];
        fetch(url + ".json")
            .then((res) => res.json())
            .then((res) => {
                if (round === 1) {
                    setRound1(parseMatchData(res));
                } else if (round === 2) {
                    setRound2(parseMatchData(res));
                } else if (round === 3) {
                    setRound3(parseMatchData(res));
                }
            });
    }

    const round_data_preview = (match_data: any) => {
        return (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm mt-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr key={match_data.p1.name + match_data.p2.name} className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                            <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Player</th>
                            <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">KO</th>
                            <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Diff</th>
                            <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Pokemon Left</th>
                            <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Pokemon</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        <tr key={match_data.p1.name} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">{match_data.p1.name} {match_data.p1.winner ? "(Winner 🏆)" : ""}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{match_data.p1.kills}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{match_data.p1.diff}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{match_data.p1.pokemon_left}</td>
                            <td key={match_data.p1.pokemon.join(", ")} className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 italic">{match_data.p1.pokemon.join(", ")}</td>
                        </tr>
                        <tr key={match_data.p2.pokemon.join(", ")} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">{match_data.p2.name} {match_data.p2.winner ? "(Winner 🏆)" : ""}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{match_data.p2.kills}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{match_data.p2.diff}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{match_data.p2.pokemon_left}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 italic">{match_data.p2.pokemon.join(", ")}</td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr key={match_data.p1.pokemon.join(", ") + match_data.p2.pokemon.join(", ")} className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                            <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Pokemon</th>
                            <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Kills</th>
                            <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Deaths</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {match_data.p1.pokemon.map((pokemon: string) => (
                            <tr key={pokemon} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">{pokemon}</td>
                                <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{match_data.pokemon_kills[pokemon]}</td>
                                <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{match_data.pokemon_deaths[pokemon]}</td>
                            </tr>
                        ))}
                        {match_data.p2.pokemon.map((pokemon: string) => (
                            <tr key={pokemon} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">{pokemon}</td>
                                <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{match_data.pokemon_kills[pokemon]}</td>
                                <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{match_data.pokemon_deaths[pokemon]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    const match_data_preview = () => {
        return (
            <div>


            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Match Data Input Form</h1>
            <Form className="flex flex-col gap-2" action="/admin">
                <label htmlFor="round1">Round 1 URL:</label>
                <div className="flex gap-2">
                    <input className="bg-zinc-50 text-black rounded-md p-2" name="round1" />
                    <button className="bg-orange-400 text-white rounded-md p-2 hover:bg-orange-500 cursor-pointer" type="button" onClick={() => fetch_round_data(document.getElementsByName("round1")[0].value, 1)}>Add Round 1 Data</button>
                    {round1 ? <button className="bg-teal-500 text-white rounded-md p-2 hover:bg-teal-600 cursor-pointer" type="button" onClick={() => setShowRound1(!showRound1)}>{showRound1 ? "Hide" : "Show"} Round 1 Data</button> : null}
                </div>
                {round1 && showRound1 ? round_data_preview(round1) : null}
                <label htmlFor="round2">Round 2 URL:</label>
                <div className="flex gap-2">
                    <input className="bg-zinc-50 text-black rounded-md p-2" name="round2" />
                    <button className="bg-orange-400 text-white rounded-md p-2 hover:bg-orange-500 cursor-pointer" type="button" onClick={() => fetch_round_data(document.getElementsByName("round2")[0].value, 2)}>Add Round 2 Data</button>
                    {round2 ? <button className="bg-teal-500 text-white rounded-md p-2 hover:bg-teal-600 cursor-pointer" type="button" onClick={() => setShowRound2(!showRound2)}>{showRound2 ? "Hide" : "Show"} Round 2 Data</button> : null}
                </div>
                {round2 && showRound2 ? round_data_preview(round2) : null}
                <label htmlFor="round3">Round 3 URL (optional):</label>
                <div className="flex gap-2">
                    <input className="bg-zinc-50 text-black rounded-md p-2" name="round3" />
                    <button className="bg-orange-400 text-white rounded-md p-2 hover:bg-orange-500 cursor-pointer" type="button" onClick={() => fetch_round_data(document.getElementsByName("round3")[0].value, 3)}>Add Round 3 Data</button>
                    {round3 ? <button className="bg-teal-500 text-white rounded-md p-2 hover:bg-teal-600 cursor-pointer" type="button" onClick={() => setShowRound3(!showRound3)}>{showRound3 ? "Hide" : "Show"} Round 3 Data</button> : null}
                </div>
                {round3 && showRound3 ? round_data_preview(round3) : null}
                {match_data ? match_data_preview(match_data) : null}
                <button className="bg-blue-400 text-white rounded-md p-2 hover:bg-blue-500 cursor-pointer mt-4" type="submit">Submit Final Data</button>
            </Form>
        </div>
    );
}