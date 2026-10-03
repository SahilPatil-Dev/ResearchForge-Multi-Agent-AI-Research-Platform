"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Check,
  ChevronDown,
  Compass,
  FileSearch,
  FileText,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ui/ThemeToggle";

const workflow = [
  {
    number: "01",
    icon: Search,
    title: "Frame the question",
    description:
      "Start with a topic or a question that deserves more than a quick answer.",
    note: "Your question",
  },
  {
    number: "02",
    icon: Compass,
    title: "Find useful sources",
    description:
      "The Search Agent uses web search to find recent, relevant material and collect source URLs.",
    note: "Search Agent",
  },
  {
    number: "03",
    icon: FileSearch,
    title: "Read the evidence",
    description:
      "The Reader Agent visits selected pages and extracts findings, dates, statistics and limitations.",
    note: "Reader Agent",
  },
  {
    number: "04",
    icon: FileText,
    title: "Build the report",
    description:
      "A writing chain organizes the supplied research into findings, analysis, limitations and sources.",
    note: "Writer",
  },
  {
    number: "05",
    icon: ShieldCheck,
    title: "Review and improve",
    description:
      "A critic scores the draft and records feedback. A revision pass runs when the quality threshold calls for it.",
    note: "Critic + revision",
  },
];

const capabilities = [
  {
    icon: Workflow,
    title: "Specialists, not one giant prompt",
    description:
      "Search, source reading, writing and critique are separate steps, each with a clear responsibility.",
  },
  {
    icon: MessageSquareText,
    title: "Progress you can follow",
    description:
      "An authenticated event stream shows updates from actual backend work, including source-by-source reading.",
  },
  {
    icon: BookOpenCheck,
    title: "Reports with structure",
    description:
      "The report format covers an introduction, key findings, analysis, limitations, conclusion and source URLs.",
  },
  {
    icon: RotateCcw,
    title: "A review loop when it helps",
    description:
      "Critic feedback can trigger a configured revision and another quality check before completion.",
  },
  {
    icon: Layers3,
    title: "A workspace that remembers",
    description:
      "Browse research history, revisit completed reports and find earlier topics with workspace search.",
  },
  {
    icon: LockKeyhole,
    title: "Your account, your research",
    description:
      "JWT-protected API routes scope research history and live updates to the signed-in account.",
  },
];

const questions = [
  {
    question: "What happens when I start a research job?",
    answer:
      "The API creates a pending job, then runs the research pipeline in a background task. The job moves through search, source reading, writing and critique; revision may follow depending on the critic score and backend configuration.",
  },
  {
    question: "Is the live progress feed simulated?",
    answer:
      "No. Pipeline callbacks write the latest actual activity message to the research record. The authenticated events endpoint streams changes from that record. If streaming is unavailable, the research detail view continues to refresh the job status through the API.",
  },
  {
    question: "Does every run revise the report?",
    answer:
      "No. The critic score is compared with the configured quality threshold. Revision runs only when the score is below that threshold and the configured revision limit allows another pass.",
  },
  {
    question: "Where do the report facts and sources come from?",
    answer:
      "The writer receives the search results and source analyses produced during that run. The prompts instruct agents not to invent facts or sources and ask the report to include source URLs. AI-generated research still needs human review, especially for high-stakes decisions.",
  },
  {
    question: "Can I keep previous research?",
    answer:
      "Yes. Signed-in users can open their research history, revisit a job, and view its report, critic feedback and score when those are available.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="landing-section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const workspaceHref = isAuthenticated ? "/workspace" : "/register";
  const actionLabel = isAuthenticated ? "Open your workspace" : "Create your workspace";

  return (
    <main className="landing-shell min-h-screen overflow-hidden">
      <div className="landing-glow landing-glow-one" aria-hidden="true" />
      <div className="landing-glow landing-glow-two" aria-hidden="true" />

      <header className="landing-header">
        <nav
          aria-label="Main navigation"
          className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8"
        >
          <Link href="/" className="flex items-center gap-3">
            <span className="brand-mark">
              <Search size={18} strokeWidth={2.2} />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              ResearchForge
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            <a className="landing-nav-link" href="#workflow">How it works</a>
            <a className="landing-nav-link" href="#capabilities">Capabilities</a>
            <a className="landing-nav-link" href="#faq">FAQ</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm text-white/65 transition hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>
            <ThemeToggle compact />
            <Link href={workspaceHref} className="button-primary hidden sm:inline-flex">
              {isAuthenticated ? "Open workspace" : "Get started"}
              <ArrowRight size={15} />
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-[1.03fr_.97fr] lg:gap-12 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div className="eyebrow">
            <Sparkles size={14} />
            MULTI-AGENT RESEARCH, MADE CLEAR
          </div>
          <h1 className="landing-title mt-7 max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-6xl lg:text-[4.5rem]">
            From a big question
            <span className="landing-title-accent"> to a clear answer.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/55 sm:text-lg">
            Turn a complex topic into an organized, source-aware report. Follow
            the work from web search through evidence review and quality checks.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={workspaceHref} className="button-primary button-primary-large">
              {isAuthenticated ? "Go to your workspace" : "Start researching"}
              <ArrowRight size={17} />
            </Link>
            <a href="#workflow" className="button-secondary">
              See how it works
              <ArrowDown size={15} />
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/40">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Live updates from real pipeline activity
            </span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <span>Search · Read · Synthesize · Review</span>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
        >
          <div className="preview-halo" aria-hidden="true" />
          <div className="glass preview-window">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="preview-dot bg-red-300/70" />
                <span className="preview-dot bg-amber-200/70" />
                <span className="preview-dot bg-emerald-200/70" />
                <span className="ml-2 text-xs text-white/45">Research activity</span>
              </div>
              <span className="pipeline-tag">Illustrative preview</span>
            </div>

            <div className="p-5 sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-5">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-violet-200/65">
                    EXAMPLE RESEARCH QUESTION
                  </p>
                  <h2 className="mt-2 max-w-sm text-base font-medium leading-6 text-white/90 sm:text-lg">
                    How might AI change the future of scientific discovery?
                  </h2>
                </div>
                <span className="preview-icon">
                  <Sparkles size={16} />
                </span>
              </div>

              <div className="glass-strong rounded-2xl p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-white/75">
                    The research pipeline
                  </span>
                  <span className="text-[10px] text-white/35">
                    Revision when needed
                  </span>
                </div>
                <div className="space-y-3">
                  {workflow.slice(1).map(({ icon: Icon, title, note }, index) => (
                    <div className="activity-row" key={title}>
                      <span className={`activity-icon activity-${["violet", "blue", "cyan", "emerald"][index]}`}>
                        <Icon size={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-white/85">
                            {title}
                          </span>
                          <span className="text-[10px] text-white/35">
                            {note}
                          </span>
                        </div>
                      </div>
                      <Check size={14} className="shrink-0 text-emerald-300/70" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-violet-200/10 bg-violet-300/[0.06] px-4 py-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-violet-300" />
                <p className="text-xs leading-5 text-white/70">
                  Preview only. A real research activity feed displays messages
                  received from the backend.
                </p>
              </div>
            </div>
          </div>
          <div className="preview-caption">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
            A clearer way to explore the unknown
            <ArrowUpRight size={13} className="ml-auto text-white/35" />
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="glass landing-principles">
          <div>
            <span className="principle-icon"><Search size={17} /></span>
            <span>Grounded in gathered material</span>
          </div>
          <div>
            <span className="principle-icon"><Workflow size={17} /></span>
            <span>Distinct, inspectable stages</span>
          </div>
          <div>
            <span className="principle-icon"><ShieldCheck size={17} /></span>
            <span>Critique before completion</span>
          </div>
          <div>
            <span className="principle-icon"><Layers3 size={17} /></span>
            <span>Saved in your workspace</span>
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="landing-section relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32"
      >
        <SectionHeading
          eyebrow="A THOUGHTFUL RESEARCH LOOP"
          title="Every stage has a purpose."
          description="A clear path from the question you ask to the report you can inspect, with quality checks built into the flow."
        />
        <div className="workflow-grid mt-12">
          {workflow.map(({ number, icon: Icon, title, description, note }, index) => (
            <motion.article
              key={number}
              className="glass workflow-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.42, delay: index * 0.07 }}
            >
              <div className="flex items-center justify-between">
                <span className="workflow-number">{number}</span>
                <span className="feature-icon"><Icon size={18} /></span>
              </div>
              <p className="workflow-note">{note}</p>
              <h3>{title}</h3>
              <p className="workflow-description">{description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section
        id="capabilities"
        className="landing-section landing-band relative z-10 px-5 py-24 sm:px-8 sm:py-32"
      >
        <div className="mx-auto w-full max-w-7xl">
          <SectionHeading
            eyebrow="MADE FOR DEEPER QUESTIONS"
            title="A workspace for the work behind the answer."
            description="ResearchForge brings together the tools and context of a research run, without hiding the process behind a single response."
          />
          <div className="capability-grid mt-12">
            {capabilities.map(({ icon: Icon, title, description }, index) => (
              <motion.article
                key={title}
                className="glass capability-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.07 }}
              >
                <span className="feature-icon"><Icon size={19} /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="eyebrow">A REPORT YOU CAN REVIEW</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            See the evidence, structure and critique in one place.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/50 sm:text-base">
            Completed research brings together a formatted report, source links,
            quality feedback and a critic score when one is available. Read it,
            copy it, or return to it later from your history.
          </p>
          <ul className="report-checklist mt-6">
            <li><Check size={15} /> Structured findings and analysis</li>
            <li><Check size={15} /> Limitations and cited source URLs</li>
            <li><Check size={15} /> Separate quality feedback</li>
          </ul>
          <Link href={workspaceHref} className="button-secondary mt-8">
            {isAuthenticated ? "View your workspace" : "Explore ResearchForge"}
            <ArrowRight size={15} />
          </Link>
        </div>

        <motion.div
          className="glass report-preview"
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <div className="report-preview-top">
            <span className="report-file-icon"><FileText size={17} /></span>
            <div>
              <p>REPORT FORMAT</p>
              <span>Example structure · not generated research</span>
            </div>
            <span className="report-score">Quality score*</span>
          </div>
          <div className="report-paper">
            <span className="report-paper-kicker">RESEARCH REPORT</span>
            <h3>What makes a useful research brief?</h3>
            <p className="report-paper-intro">
              An example of the report structure. Run a research question to
              generate your own findings.
            </p>
            <div className="report-paper-rule" />
            <div className="report-paper-section">
              <span>01</span>
              <div><strong>Key findings</strong><i /><i className="short" /></div>
            </div>
            <div className="report-paper-section">
              <span>02</span>
              <div><strong>Analysis &amp; context</strong><i /><i className="medium" /></div>
            </div>
            <div className="report-paper-section">
              <span>03</span>
              <div><strong>Limitations &amp; sources</strong><i /><i className="short" /></div>
            </div>
          </div>
          <p className="report-preview-footnote">
            *The quality score comes from the report critic; it is not a
            guarantee of accuracy.
          </p>
        </motion.div>
      </section>

      <section className="landing-section relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="glass transparency-panel">
          <div className="transparency-copy">
            <span className="feature-icon"><ShieldCheck size={19} /></span>
            <p className="eyebrow mt-5">A NOTE ON TRUST</p>
            <h2>Useful research is research you can question.</h2>
            <p>
              ResearchForge asks its agents to use supplied source material,
              include source URLs and flag limitations. The critic provides an
              additional review pass—not independent verification. Always
              inspect the underlying sources and use your judgment for
              high-impact decisions.
            </p>
          </div>
          <div className="transparency-list">
            <div><Check size={16} /><span>Source URLs are included in the report format.</span></div>
            <div><Check size={16} /><span>Critic feedback is saved alongside completed research.</span></div>
            <div><Check size={16} /><span>Progress messages are emitted by real pipeline stages.</span></div>
            <div><Check size={16} /><span>Authenticated routes limit access to the job owner.</span></div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="landing-section relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-5 pb-24 sm:px-8 sm:pb-32 lg:grid-cols-[.7fr_1.3fr]"
      >
        <div>
          <p className="eyebrow">GOOD TO KNOW</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            A few useful details.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/45">
            Understand how the research process works before you start your
            first run.
          </p>
        </div>
        <div className="faq-list">
          {questions.map(({ question, answer }) => (
            <details className="glass faq-item" key={question}>
              <summary>
                <span>{question}</span>
                <ChevronDown size={17} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="glass landing-cta">
          <div className="landing-cta-glow" aria-hidden="true" />
          <div className="relative z-10">
            <p className="eyebrow">YOUR NEXT QUESTION STARTS HERE</p>
            <h2>Make room for a deeper answer.</h2>
            <p>
              Bring a question. Follow the research. Keep the result close.
            </p>
          </div>
          <Link href={workspaceHref} className="button-primary button-primary-large relative z-10">
            {actionLabel}
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.07] px-5 py-7 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="brand-mark brand-mark-small"><Search size={14} /></span>
            <span className="text-xs font-semibold">ResearchForge</span>
          </Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/40">
            <a href="#workflow" className="footer-link">How it works</a>
            <a href="#capabilities" className="footer-link">Capabilities</a>
            <Link href="/login" className="footer-link">Sign in</Link>
            <span>© {new Date().getFullYear()} ResearchForge</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
