interface Props {
  report: string;
}

export default function ReportView({
  report,
}: Props) {
  const copyReport =
    async () => {
      await navigator.clipboard.writeText(
        report
      );
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
        {report
          .split("\n")
          .map(
            (line, index) => {
              if (
                line.startsWith("# ")
              ) {
                return (
                  <h1
                    key={index}
                    className="mb-6 text-3xl font-semibold"
                  >
                    {line.slice(2)}
                  </h1>
                );
              }

              if (
                line.startsWith("## ")
              ) {
                return (
                  <h2
                    key={index}
                    className="mb-4 mt-10 text-2xl font-medium"
                  >
                    {line.slice(3)}
                  </h2>
                );
              }

              if (
                line.startsWith("- ")
              ) {
                return (
                  <li
                    key={index}
                    className="ml-5 text-white/65"
                  >
                    {line.slice(2)}
                  </li>
                );
              }

              if (!line.trim()) {
                return (
                  <div
                    key={index}
                    className="h-3"
                  />
                );
              }

              return (
                <p
                  key={index}
                  className="leading-8 text-white/65"
                >
                  {line}
                </p>
              );
            }
          )}
      </div>
    </article>
  );
}