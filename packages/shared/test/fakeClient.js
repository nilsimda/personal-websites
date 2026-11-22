// Minimal stand-in for the Supabase query builder used by the public pages.
// Applies eq() filters to in-memory rows and records them. No network.
export function createFakeClient(rows, { error = null } = {}) {
    const calls = [];
    const client = {
        from(table) {
            const filters = [];
            calls.push({ table, filters });
            const b = {
                select: () => b,
                eq: (col, val) => {
                    filters.push([col, val]);
                    return b;
                },
                order: () => b,
                maybeSingle: () => b,
                single: () => b,
                then: (resolve, reject) =>
                    Promise.resolve()
                        .then(() => {
                            if (error) return { data: null, error };
                            const hit = rows.filter((r) =>
                                filters.every(([c, v]) => String(r[c]) === String(v)),
                            );
                            return { data: hit[0] ?? null, error: null };
                        })
                        .then(resolve, reject),
            };
            return b;
        },
    };
    return { client, calls };
}

export const rows = [
    { id: '1', user_id: 'site-ines', title: 'Ines Beitrag', text: 'A', date: '2026-01-01', contentType: 'blog', imageUrl: 'https://x/a.png' },
    { id: '2', user_id: 'site-jens', title: 'Jens Beitrag', text: 'B', date: '2026-01-02', contentType: 'blog', imageUrl: 'https://x/b.png' },
];
