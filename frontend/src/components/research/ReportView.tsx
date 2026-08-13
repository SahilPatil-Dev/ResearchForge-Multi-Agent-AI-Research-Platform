import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  report: string;
}

export default function ReportView({
  report,
}: Props) {
  const copyReport = async () => {
    await navigator.clipboard.writeText(report);
  };

  return (
    <article className="glass-strong rounded-3xl p-6 sm:p-10 lg:p-14">
      <div className="mb-8 flex justify-end">
        <button
          onClick={copyReport}
          className="rounded-xl bg-white/5 px-3 py-2 text-xs text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          Copy Report
        </button>
      </div>

      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="mb-6 text-3xl font-semibold text-white">
                {children}
              </h1>
            ),

            h2: ({ children }) => (
              <h2 className="mb-4 mt-10 text-2xl font-medium text-white">
                {children}
              </h2>
            ),

            h3: ({ children }) => (
              <h3 className="mb-3 mt-8 text-xl font-medium text-white">
                {children}
              </h3>
            ),

            p: ({ children }) => (
              <p className="mb-5 leading-8 text-white/65">
                {children}
              </p>
            ),

            ul: ({ children }) => (
              <ul className="mb-6 ml-5 list-disc space-y-2 text-white/65">
                {children}
              </ul>
            ),

            ol: ({ children }) => (
              <ol className="mb-6 ml-5 list-decimal space-y-2 text-white/65">
                {children}
              </ol>
            ),

            li: ({ children }) => (
              <li className="pl-1 leading-7">
                {children}
              </li>
            ),

            strong: ({ children }) => (
              <strong className="font-semibold text-white">
                {children}
              </strong>
            ),

            em: ({ children }) => (
              <em className="text-white/80">
                {children}
              </em>
            ),

            hr: () => (
              <hr className="my-10 border-white/10" />
            ),

            blockquote: ({ children }) => (
              <blockquote className="my-6 rounded-xl border-l-4 border-white/20 bg-white/[0.03] px-5 py-3 text-white/60">
                {children}
              </blockquote>
            ),

            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                {children}
              </a>
            ),

            code: ({ children }) => (
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white/80">
                {children}
              </code>
            ),

            pre: ({ children }) => (
              <pre className="my-6 overflow-x-auto rounded-2xl bg-black/30 p-5 text-sm">
                {children}
              </pre>
            ),

            table: ({ children }) => (
              <div className="my-6 overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  {children}
                </table>
              </div>
            ),

            th: ({ children }) => (
              <th className="border-b border-white/10 bg-white/5 px-4 py-3 font-semibold text-white">
                {children}
              </th>
            ),

            td: ({ children }) => (
              <td className="border-b border-white/5 px-4 py-3 text-white/65">
                {children}
              </td>
            ),
          }}
        >
          {report}
        </ReactMarkdown>
      </div>
    </article>
  );
}