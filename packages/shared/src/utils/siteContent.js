/**
 * Load one public content entry for this site.
 *
 * The lists filter by the site owner's `user_id`; the detail view must do the
 * same, otherwise any entry id from another portfolio would render here.
 * Resolves to the row, or null when it does not exist, belongs to another
 * site, or the site id is not configured. Rejects on query errors.
 */
export async function fetchSiteContent(client, { id, siteId }) {
    if (!id || !siteId) return null;

    const { data, error } = await client
        .from('content')
        .select('*')
        .eq('id', id)
        .eq('user_id', siteId)
        .maybeSingle();

    if (error) throw error;
    return data ?? null;
}
