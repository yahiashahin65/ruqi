/** Preserve legacy detail URLs without making explicit drafts public.
 * Older records lacking a status field were accessible by slug before V3.
 * A record with status="draft" must remain private; any other explicit
 * unknown status is rejected rather than silently published.
 */
export function isPublicDetailStatus(data: { status?: unknown }): boolean {
  return data.status === "published" || data.status === undefined || data.status === null;
}
