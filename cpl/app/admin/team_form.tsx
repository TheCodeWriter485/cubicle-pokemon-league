'use client'
import { useState } from 'react';

export default function TeamForm() {
    const [form, setForm] = useState({
        Username: '',
        League: 'Major',
        TeamName: '',
        showdown_acct: '',
        Logo: '',
        Epithat: '',
        TrainerTip: '',
        Season: 1,
        Wins: 0,
        Losses: 0,
        KO: 0,
        Dif: 0,
        ELO: 1000,
        Points: 100,
        trades: 20
    });
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const updateField = (field: string, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('http://localhost:3030/team/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.sqlMessage) {
                setError(data.sqlMessage);
            } else {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
                setForm({
                    Username: '',
                    League: 'Major',
                    TeamName: '',
                    showdown_acct: '',
                    Logo: '',
                    Epithat: '',
                    TrainerTip: '',
                    Season: 1,
                    Wins: 0,
                    Losses: 0,
                    KO: 0,
                    Dif: 0,
                    ELO: 1000,
                    Points: 100,
                    trades: 20
                });
            }
        } catch (err) {
            setError('Failed to create team.');
            console.error(err);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {saved && <p style={{ color: 'green', fontWeight: 'bold' }}>Team created successfully!</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Username</label>
                    <input
                        required
                        type="text"
                        placeholder="Linked account username"
                        value={form.Username}
                        onChange={e => updateField('Username', e.target.value)}
                        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>


                {/* Team Name */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Team Name</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. Buenos Muchachos"
                        value={form.TeamName}
                        onChange={e => updateField('TeamName', e.target.value)}
                        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* Team Name */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Team Name</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. greatbed2"
                        value={form.showdown_acct}
                        onChange={e => updateField('showdown_acct', e.target.value)}
                        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* League */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">League</label>
                    <select
                        value={form.League}
                        onChange={e => updateField('League', e.target.value)}
                        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="Major">Major</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Minor">Minor</option>
                    </select>
                </div>

                {/* Season */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Season</label>
                    <input
                        type="number"
                        value={form.Season}
                        onChange={e => updateField('Season', Number(e.target.value))}
                        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* Logo */}
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm font-semibold">Logo URL</label>
                    <input
                        type="text"
                        placeholder="https://..."
                        value={form.Logo}
                        onChange={e => updateField('Logo', e.target.value)}
                        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* Epithet */}
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm font-semibold">Epithet</label>
                    <input
                        type="text"
                        placeholder="Team tagline or nickname"
                        value={form.Epithat}
                        onChange={e => updateField('Epithat', e.target.value)}
                        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* Trainer Tip */}
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm font-semibold">Trainer Tip</label>
                    <input
                        type="text"
                        placeholder="A short quote or tip from the trainer"
                        value={form.TrainerTip}
                        onChange={e => updateField('TrainerTip', e.target.value)}
                        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Starting Points', field: 'Points' },
                    { label: 'Starting ELO', field: 'ELO' },
                    { label: 'Wins', field: 'Wins' },
                    { label: 'Losses', field: 'Losses' },
                    { label: 'KO', field: 'KO' },
                    { label: 'Dif', field: 'Dif' },
                ].map(({ label, field }) => (
                    <div key={field} className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">{label}</label>
                        <input
                            type="number"
                            value={(form as any)[field]}
                            onChange={e => updateField(field, Number(e.target.value))}
                            className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                ))}
            </div>

            <button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors mt-2"
            >
                Create Team
            </button>
        </form>
    );
}