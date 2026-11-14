type Props = {
  links: { href: string; label: string }[];
};

export function References({ links }: Props) {
  return (
    <section className="grid gap-2">
      <h2 className="font-semibold">References</h2>
      <ul className="list-inside list-disc">
        {links.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-blue-500 visited:text-purple-500 hover:underline"
            >
              {label}
            </a>
          </li>
        ))}
        <li>
          <a
            href={`${import.meta.env.BASE_URL}third-party-notices.txt`}
            className="text-blue-500 visited:text-purple-500 hover:underline"
          >
            Third-party notices
          </a>
        </li>
      </ul>
    </section>
  );
}
