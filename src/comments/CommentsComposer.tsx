import { useState } from "react";

import { CopyButton } from "../components/CopyButton";
import { PreviewPanel } from "../components/PreviewPanel";
import { References } from "../components/References";
import { useFieldError } from "../hooks/useFieldError";
import { COMMENT_LABEL_OPTIONS, composeConventionalComment } from "./composeConventionalComment";
import type { CommentLabel } from "./composeConventionalComment";
import { validateComment } from "./validateComment";

export function CommentsComposer() {
  const [label, setLabel] = useState<CommentLabel>("praise");
  const [decoration, setDecoration] = useState("");
  const [subject, setSubject] = useState("");
  const [discussion, setDiscussion] = useState("");
  const validation = validateComment({ label, decorations: decoration, subject });
  const subjectError = useFieldError(validation.errors.subject);
  const preview = composeConventionalComment({
    label,
    decorations: decoration,
    subject,
    discussion,
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <label htmlFor="comment-label">Label</label>
        <select
          id="comment-label"
          value={label}
          onChange={(event) => setLabel(event.target.value as CommentLabel)}
          className="bg-foreground/3 hover:bg-foreground/6 min-w-0 rounded p-2 motion-safe:transition-colors"
        >
          {COMMENT_LABEL_OPTIONS.map((item) => (
            <option key={item.value} value={item.value} className="bg-background text-foreground">
              {item.value}: {item.description}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <label htmlFor="comment-decorations">Decorations (optional)</label>
        <select
          id="comment-decorations"
          value={decoration}
          onChange={(event) => setDecoration(event.target.value)}
          className="bg-foreground/3 hover:bg-foreground/6 min-w-0 rounded p-2 motion-safe:transition-colors"
        >
          <option value="" className="bg-background text-foreground">
            none
          </option>
          <option value="blocking" className="bg-background text-foreground">
            blocking: must resolve
          </option>
          <option value="non-blocking" className="bg-background text-foreground">
            non-blocking: may follow up
          </option>
          <option value="if-minor" className="bg-background text-foreground">
            if-minor: only if the change is small
          </option>
        </select>
      </div>
      <div className="grid gap-2">
        <label htmlFor="comment-subject">Subject</label>
        <input
          id="comment-subject"
          {...subjectError.inputProps}
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="This is not worded correctly."
          className="bg-foreground/3 hover:bg-foreground/6 rounded p-2 motion-safe:transition-colors"
        />
        <div role="alert" className="empty:absolute">
          {subjectError.error && (
            <p
              id={subjectError.errorId}
              className="text-red-500 motion-safe:transition-opacity motion-safe:starting:opacity-0"
            >
              {subjectError.error}
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-2">
        <label htmlFor="comment-discussion">Discussion (optional)</label>
        <textarea
          id="comment-discussion"
          value={discussion}
          onChange={(event) => setDiscussion(event.target.value)}
          placeholder="Can we change this to match the wording of the marketing page?"
          rows={3}
          className="bg-foreground/3 hover:bg-foreground/6 rounded p-2 motion-safe:transition-colors"
        />
      </div>
      <PreviewPanel text={preview}>
        <CopyButton text={preview} variant="comments" disabled={!validation.valid} />
      </PreviewPanel>
      <References
        links={[{ href: "https://conventionalcomments.org/", label: "Conventional Comments" }]}
      />
    </div>
  );
}
