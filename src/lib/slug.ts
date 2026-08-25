/**
 * Lives on its own so the publish form can derive an agent's slug in the
 * browser — and so preview scores match what the published page will show —
 * without pulling the whole catalogue into the client bundle.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
