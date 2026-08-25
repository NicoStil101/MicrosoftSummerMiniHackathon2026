"use client";

import { useActionState, useEffect, useRef } from "react";
import { postComment } from "@/lib/actions";
import { EMPTY_COMMENT_STATE } from "@/lib/comment-state";
import { timeAgo } from "@/lib/format";
import type { AgentComment } from "@/lib/types";

export function CommentSection({
  agentSlug,
  comments,
}: {
  agentSlug: string;
  comments: AgentComment[];
}) {
  const [state, formAction, isPending] = useActionState(
    postComment,
    EMPTY_COMMENT_STATE,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the box once the server confirms the comment landed.
  useEffect(() => {
    if (state.status === "posted") formRef.current?.reset();
  }, [state]);

  return (
    <section className="mt-12 max-w-2xl">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
          Comments
        </h2>
        <span className="text-xs text-subtle">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      <form
        ref={formRef}
        action={formAction}
        className="mt-4 border border-line bg-surface p-4"
      >
        <input type="hidden" name="agentSlug" value={agentSlug} />



        <label className="mt-3 block">
          <span className="text-xs text-muted">Comment</span>
          <textarea
            name="body"
            rows={2}
            maxLength={1000}
            placeholder="How does this agent hold up in production?"
            className="mt-1 w-full resize-y border border-line bg-background px-2.5 py-1.5 text-[13px] leading-relaxed placeholder:text-subtle focus:border-accent focus:outline-none"
          />
          {state.errors.body && <ErrorText>{state.errors.body}</ErrorText>}
        </label>

        <div className="mt-3 flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {isPending ? "Posting…" : "Post comment"}
          </button>
          {state.status === "posted" && (
            <span className="text-xs text-ok" role="status">
              Posted.
            </span>
          )}
        </div>
      </form>

      {comments.length > 0 ? (
        <ol className="mt-5 space-y-3">
          {comments.map((comment) => (
            <li key={comment.id} className="border-l-2 border-line pl-4">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold">{comment.author}</span>
                <span className="text-xs text-subtle">
                  {timeAgo(comment.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                {comment.body}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 text-sm text-subtle">
          No comments yet. Be the first to say how this agent behaves in
          production.
        </p>
      )}
    </section>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-bad">{children}</p>;
}
