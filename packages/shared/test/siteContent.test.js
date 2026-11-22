import { describe, expect, it } from 'vitest';
import { fetchSiteContent } from '../src/utils/siteContent.js';
import { createFakeClient, rows } from './fakeClient.js';

describe('fetchSiteContent', () => {
    it("returns this site's entry, filtering by id and site owner", async () => {
        const { client, calls } = createFakeClient(rows);
        const content = await fetchSiteContent(client, { id: '1', siteId: 'site-ines' });
        expect(content.title).toBe('Ines Beitrag');
        expect(calls).toEqual([
            { table: 'content', filters: [['id', '1'], ['user_id', 'site-ines']] },
        ]);
    });

    it("does not resolve another site's entry", async () => {
        const { client } = createFakeClient(rows);
        expect(await fetchSiteContent(client, { id: '2', siteId: 'site-ines' })).toBeNull();
    });

    it('returns null for an unknown id', async () => {
        const { client } = createFakeClient(rows);
        expect(await fetchSiteContent(client, { id: '999', siteId: 'site-ines' })).toBeNull();
    });

    it('does not query at all without a configured site id', async () => {
        const { client, calls } = createFakeClient(rows);
        expect(await fetchSiteContent(client, { id: '1', siteId: undefined })).toBeNull();
        expect(await fetchSiteContent(client, { id: '1', siteId: '' })).toBeNull();
        expect(calls).toHaveLength(0);
    });

    it('rejects on query errors', async () => {
        const { client } = createFakeClient(rows, { error: { message: 'boom' } });
        await expect(fetchSiteContent(client, { id: '1', siteId: 'site-ines' })).rejects.toEqual({ message: 'boom' });
    });
});
