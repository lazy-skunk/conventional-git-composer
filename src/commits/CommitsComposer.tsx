import { CopyButton } from "../components/CopyButton";
import { PreviewPanel } from "../components/PreviewPanel";
import { References } from "../components/References";
import { useFieldError } from "../hooks/useFieldError";
import {
  BREAKING_CHANGE_OPTIONS,
  isBreakingChangeDescriptionRequired,
  type BreakingChangeStyle,
} from "./breakingChange";
import { COMMIT_TYPE_OPTIONS, type CommitType } from "./commitType";
import { FooterInput } from "./FooterInput";
import { useConventionalCommitsComposer } from "./useConventionalCommitsComposer";

export function CommitsComposer() {
  const composer = useConventionalCommitsComposer();
  const descriptionError = useFieldError(composer.errors.description);
  const breakingChangeError = useFieldError(composer.errors.breakingChangeDescription);
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="commit-type">Type</label>
          <select
            id="commit-type"
            value={composer.commitType}
            onChange={(event) => composer.setCommitType(event.target.value as CommitType)}
            className="bg-foreground/3 hover:bg-foreground/6 rounded p-2 motion-safe:transition-colors"
          >
            {COMMIT_TYPE_OPTIONS.map(({ value, description }) => (
              <option key={value} value={value} className="bg-background text-foreground">
                {description ? `${value}: ${description}` : value}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label htmlFor="scope">Scope (optional)</label>

          <input
            id="scope"
            value={composer.scope}
            onChange={(event) => composer.setScope(event.target.value)}
            className="bg-foreground/3 hover:bg-foreground/6 rounded p-2 motion-safe:transition-colors"
            placeholder="lang"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="description">Description</label>

          <input
            id="description"
            {...descriptionError.inputProps}
            value={composer.description}
            onChange={(event) => composer.setDescription(event.target.value)}
            className="bg-foreground/3 hover:bg-foreground/6 rounded p-2 motion-safe:transition-colors"
            placeholder="add Polish language"
          />
          <div role="alert" className="empty:absolute">
            {descriptionError.error && (
              <p
                id={descriptionError.errorId}
                className="text-red-500 motion-safe:transition-opacity motion-safe:starting:opacity-0"
              >
                {descriptionError.error}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="body">Body (optional)</label>

          <textarea
            id="body"
            value={composer.body}
            onChange={(event) => composer.setBody(event.target.value)}
            className="bg-foreground/3 hover:bg-foreground/6 rounded p-2 motion-safe:transition-colors"
            rows={3}
            placeholder="Introduce a request id and a reference to latest request."
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="breaking-change-style">Breaking change</label>
          <select
            id="breaking-change-style"
            value={composer.breakingChangeStyle}
            onChange={(event) =>
              composer.setBreakingChangeStyle(event.target.value as BreakingChangeStyle)
            }
            className="bg-foreground/3 hover:bg-foreground/6 rounded p-2 motion-safe:transition-colors"
          >
            {BREAKING_CHANGE_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-background text-foreground"
              >
                {`${option.value}: ${option.description}`}
              </option>
            ))}
          </select>

          {isBreakingChangeDescriptionRequired(composer.breakingChangeStyle) && (
            <div className="grid gap-2">
              <label htmlFor="breaking-change-description">Breaking change description</label>
              <textarea
                id="breaking-change-description"
                {...breakingChangeError.inputProps}
                value={composer.breakingChangeDescription}
                name="breaking_change_description"
                onChange={(event) => composer.setBreakingChangeDescription(event.target.value)}
                className="bg-foreground/3 hover:bg-foreground/6 rounded p-2 motion-safe:transition-colors"
                rows={2}
                placeholder="use JavaScript features not available in Node 6."
              />
              <div role="alert" className="empty:absolute">
                {breakingChangeError.error && (
                  <p
                    id={breakingChangeError.errorId}
                    className="text-red-500 motion-safe:transition-opacity motion-safe:starting:opacity-0"
                  >
                    {breakingChangeError.error}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <FooterInput
          rows={composer.footerEditor.rows}
          addRow={composer.footerEditor.addRow}
          removeRow={composer.footerEditor.removeRow}
          updateRow={composer.footerEditor.updateRow}
        />
      </div>

      <PreviewPanel text={composer.commitPreview}>
        <CopyButton variant="commits" text={composer.commitPreview} disabled={!composer.canCopy} />
      </PreviewPanel>

      <References
        links={[
          {
            href: "https://www.conventionalcommits.org/en/v1.0.0/",
            label: "Conventional Commits 1.0.0",
          },
          {
            href: "https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/src/index.ts",
            label: "commitlint config-conventional",
          },
        ]}
      />
    </div>
  );
}
