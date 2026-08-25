/**
 * Shared between the upload form and the server action. It lives outside
 * actions.ts because a "use server" module may only export async functions —
 * a plain constant exported from there arrives as undefined on the client.
 */
export interface UploadState {
  status: "idle" | "error";
  errors: Record<string, string>;
  /** Echoed back so the form can repopulate after a failed submit. */
  values?: Record<string, string>;
}

export const EMPTY_UPLOAD_STATE: UploadState = { status: "idle", errors: {} };
