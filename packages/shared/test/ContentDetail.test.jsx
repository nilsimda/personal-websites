import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createFakeClient, rows } from './fakeClient.js';

const db = vi.hoisted(() => ({ current: null }));

vi.mock('@monorepo/shared/utils', () => ({
    get supabase() {
        return db.current.client;
    },
}));
vi.mock('@monorepo/shared/components', () => ({
    Embed: ({ content }) => <div data-testid="embed">{content.imageUrl}</div>,
    DynamicNavigation: () => <nav />,
}));

import ContentDetail from '../src/pages/ContentDetail.jsx';

const renderAt = (path, props = {}) =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path="/content/:id" element={<ContentDetail {...props} />} />
                <Route path="/" element={<div>Startseite</div>} />
            </Routes>
        </MemoryRouter>,
    );

beforeEach(() => {
    db.current = createFakeClient(rows);
    vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

describe('ContentDetail', () => {
    it("renders an entry of this site (site id from VITE_SUPABASE_USER_ID)", async () => {
        renderAt('/content/1');
        expect(await screen.findByRole('heading', { name: 'Ines Beitrag' })).toBeTruthy();
        expect(db.current.calls[0].filters).toContainEqual(['user_id', 'site-ines']);
    });

    it("does not render another site's entry", async () => {
        renderAt('/content/2');
        expect(await screen.findByText('Beitrag nicht gefunden')).toBeTruthy();
        expect(screen.queryByText('Jens Beitrag')).toBeNull();
        expect(screen.queryByTestId('embed')).toBeNull();
    });

    it('renders the other site correctly when configured for it', async () => {
        renderAt('/content/2', { siteId: 'site-jens' });
        expect(await screen.findByRole('heading', { name: 'Jens Beitrag' })).toBeTruthy();
    });

    it('shows a not-found page for an unknown id instead of crashing', async () => {
        renderAt('/content/does-not-exist');
        expect(await screen.findByText('Beitrag nicht gefunden')).toBeTruthy();
        expect(screen.getByRole('link', { name: 'Zur Startseite' }).getAttribute('href')).toBe('/');
    });

    it('fails closed when the site id is not configured', async () => {
        renderAt('/content/1', { siteId: '' });
        expect(await screen.findByText('Beitrag nicht gefunden')).toBeTruthy();
        expect(db.current.calls).toHaveLength(0);
    });

    it('shows an error state when the query fails', async () => {
        db.current = createFakeClient(rows, { error: { message: 'network' } });
        renderAt('/content/1');
        expect(await screen.findByText('Beitrag konnte nicht geladen werden')).toBeTruthy();
    });
});
