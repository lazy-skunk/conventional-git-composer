type Props = { text: string; children?: React.ReactNode };

export function PreviewPanel({ text, children }: Props) {
  return (
    <section className="grid gap-2">
      <h2 className="font-semibold">Preview</h2>
      <div className="bg-foreground/3 rounded p-2">
        <pre className="break-words whitespace-pre-wrap">{text}</pre>
        <div className="flex justify-end">{children}</div>
      </div>
    </section>
  );
}
