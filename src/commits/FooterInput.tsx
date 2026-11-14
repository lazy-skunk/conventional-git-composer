import type { FooterEntry } from "./footer";
import { FooterRowItem } from "./FooterRowItem";
import type { FooterEditorRow } from "./useFooterEditor";

type Props = {
  rows: FooterEditorRow[];
  addRow: () => void;
  removeRow: (rowId: string) => void;
  updateRow: (rowId: string, updatedFields: Partial<FooterEntry>) => void;
};

export function FooterInput({ rows, addRow, removeRow, updateRow }: Props) {
  return (
    <fieldset>
      <legend>Footer (optional)</legend>

      <div className="bg-foreground/3 w-full space-y-2 rounded p-2">
        {rows.map((row) => (
          <FooterRowItem
            key={row.id}
            row={row}
            canRemove={rows.length > 1}
            onChangeRow={(rowUpdate) => updateRow(row.id, rowUpdate)}
            onRemoveRow={() => removeRow(row.id)}
          />
        ))}

        <button
          type="button"
          onClick={addRow}
          className="cursor-pointer rounded bg-green-100 px-4 py-2 text-green-900 motion-safe:transition motion-safe:active:translate-y-px dark:bg-green-900 dark:text-green-100"
        >
          Add footer
        </button>
      </div>
    </fieldset>
  );
}
