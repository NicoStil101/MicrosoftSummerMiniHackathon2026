/**
 * Shared between the comment form and its server action. It lives outside
 * actions.ts because a "use server" module may only export async functions —
 * a plain constant exported from there arrives as undefined on the client.
 */
export interface CommentState {
  status: "idle" | "error" | "posted";
  errors: Record<string, string>;
}

export const EMPTY_COMMENT_STATE: CommentState = { status: "idle", errors: {} };
