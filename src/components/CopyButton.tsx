import { useEffect, useState } from "react";

import { copyToClipboard } from "../lib/clipboard";

type Props = { text: string; variant: "commits" | "comments" | "branch"; disabled?: boolean };

const COPY_RESULT_DISPLAY_MILLISECONDS = 2000;

export function CopyButton({ text, variant, disabled = false }: Props) {
  const [copyResult, setCopyResult] = useState<{ text: string; success: boolean } | null>(null);

  useEffect(() => {
    if (!copyResult?.success) return;

    const timeout = setTimeout(() => setCopyResult(null), COPY_RESULT_DISPLAY_MILLISECONDS);
    return () => clearTimeout(timeout);
  }, [copyResult]);

  const currentCopyResult = copyResult?.text === text ? copyResult : null;

  const handleCopy = async () => {
    setCopyResult(null);
    const success = await copyToClipboard(text);

    setCopyResult({ text, success });
  };

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        disabled={disabled}
        onClick={() => void handleCopy()}
        className={`disabled:bg-foreground/3 disabled:text-foreground/50 inline-flex cursor-pointer items-center gap-2 rounded px-4 py-2 disabled:cursor-not-allowed disabled:bg-none disabled:active:translate-y-0 motion-safe:transition motion-safe:active:translate-y-px ${variant === "comments" ? "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100" : variant === "branch" ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100" : "bg-linear-45 from-pink-100 to-orange-100 text-pink-900 dark:from-pink-900 dark:to-orange-900 dark:text-pink-100"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-5 w-5"
          aria-hidden
          focusable="false"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
          />
        </svg>
        <span>{currentCopyResult?.success ? "Copied" : "Copy"}</span>
      </button>
      <div role="alert" className="empty:absolute">
        {currentCopyResult?.success === false && (
          <p className="text-red-500 motion-safe:transition-opacity motion-safe:starting:opacity-0">
            Copy failed. Please copy the preview manually.
          </p>
        )}
      </div>
    </div>
  );
}
