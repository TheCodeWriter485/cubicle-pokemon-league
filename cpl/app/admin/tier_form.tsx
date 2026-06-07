'use client'
import { useState } from 'react';

export default function TierForm() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success?: boolean, updated?: number, errors?: number, error?: string } | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!file) return;

        const confirmed = confirm(
            "Warning: This will archive the current tier list, reset all season stats, and apply the new point values. Are you sure?"
        );
        if (!confirmed) return;

        setLoading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('csv', file);

            const res = await fetch('http://129.80.79.84:3030/admin/tierlist/update', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await res.json();
            setResult(data);
        } catch (err) {
            setResult({ error: 'Failed to connect to server.' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Upload a CSV with <strong>pokemon</strong> and <strong>point</strong> columns.
                This will archive the current season, reset stats, and apply new point values.
                Any Pokémon not in the CSV will be set to point value 21 (banned).
            </p>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Tier List CSV</label>
                <input
                    type="file"
                    accept=".csv"
                    required
                    onChange={e => setFile(e.target.files?.[0] ?? null)}
                    className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>

            {file && (
                <p className="text-sm text-zinc-500">Selected: <strong>{file.name}</strong></p>
            )}

            <button
                type="submit"
                disabled={loading || !file}
                className="bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold transition-colors mt-2"
            >
                {loading ? 'Processing...' : 'Submit New Tier List'}
            </button>

            {result && (
                <div style={{
                    marginTop: '1rem',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: result.error ? '#3a1a1a' : '#1a3a1a',
                    border: `1px solid ${result.error ? '#dc3545' : '#28a745'}`,
                    color: 'white'
                }}>
                    {result.error ? (
                        <p>❌ Error: {result.error}</p>
                    ) : (
                        <>
                            <p>✅ Tier list updated successfully!</p>
                            <p className="text-sm" style={{ color: '#aaa' }}>
                                {result.updated} Pokémon updated. {result.errors ? `${result.errors} failed.` : ''}
                            </p>
                        </>
                    )}
                </div>
            )}
        </form>
    );
}