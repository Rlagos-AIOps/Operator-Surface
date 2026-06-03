import ReactMarkdown from "react-markdown";

interface Props {
  source: string;
}

/**
 * Markdown body for the brief. Custom component overrides so the
 * rendered content adopts our design tokens instead of stock browser
 * styling.
 *
 * Server-safe — react-markdown is pure rendering.
 */
export function BodyMd({ source }: Props) {
  return (
    <section className="mb-s7 max-w-[68ch]">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h2 className="font-serif text-h2 text-paper mt-s7 mb-s4 first:mt-0">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="font-serif text-h3 text-paper mt-s6 mb-s3 first:mt-0">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="font-sans font-bold text-h4 text-paper mt-s5 mb-s3 first:mt-0">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-body text-paper my-s3 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-s3 list-disc space-y-s1 pl-s5 text-body text-paper">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-s3 list-decimal space-y-s1 pl-s5 text-body text-paper">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-bold text-paper">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-lime underline decoration-lime/40 underline-offset-2 hover:decoration-lime"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded-sm bg-bg-deep/60 px-1 py-[1px] font-mono text-small text-paper">
              {children}
            </code>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </section>
  );
}
