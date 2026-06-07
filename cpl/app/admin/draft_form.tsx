'use client'
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

export default function DraftForm() {
    const [schedule, setSchedule] = useState<any>({
        Minor: { draft_date: '', start_time: '', end_time: '' },
        Intermediate: { draft_date: '', start_time: '', end_time: '' },
        Major: { draft_date: '', start_time: '', end_time: '' },
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch('http://129.80.79.84:3030/draft/schedule')
            .then(res => res.json())
            .then(data => {
                const updated = { ...schedule };
                data.forEach((entry: any) => {
                    if (updated[entry.league]) {
                        updated[entry.league] = {
                            draft_date: entry.draft_date?.split('T')[0] ?? '',
                            start_time: entry.start_time ?? '',
                            end_time: entry.end_time ?? ''
                        };
                    }
                });
                setSchedule(updated);
            });
    }, []);

    async function handleSave(league: string) {
        const { draft_date, start_time, end_time } = schedule[league];
        await fetch('http://129.80.79.84:3030/draft/set', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ league, draft_date, start_time, end_time })
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    const updateField = (league: string, field: string, value: string) => {
        setSchedule((prev: any) => ({
            ...prev,
            [league]: { ...prev[league], [field]: value }
        }));
    };

    const renderLeagueForm = (league: string) => (
        <div key={league} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #dee2e6', borderRadius: '8px' }}>
            <h5 style={{ marginBottom: '1rem' }}>{league} League</h5>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Draft Date</label>
                    <input
                        type="date"
                        value={schedule[league].draft_date}
                        onChange={e => updateField(league, 'draft_date', e.target.value)}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #dee2e6' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Start Time</label>
                    <input
                        type="time"
                        value={schedule[league].start_time}
                        onChange={e => updateField(league, 'start_time', e.target.value)}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #dee2e6' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>End Time</label>
                    <input
                        type="time"
                        value={schedule[league].end_time}
                        onChange={e => updateField(league, 'end_time', e.target.value)}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #dee2e6' }}
                    />
                </div>
                <Button variant="primary" onClick={() => handleSave(league)}>
                    Save
                </Button>
            </div>
        </div>
    );

    return (
        <div>
            <h4>Draft Schedule</h4>
            {saved && <p style={{ color: 'green' }}>Saved successfully!</p>}
            {['Minor', 'Intermediate', 'Major'].map(league => renderLeagueForm(league))}
        </div>
    );
}