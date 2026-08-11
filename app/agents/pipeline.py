import re
from dataclasses import dataclass, field
from typing import List

from app.agents.agents import (
    build_reader_agent,
    build_search_agent,
    critic_chain,
    revision_chain,
    writer_chain,
)
from app.core.config import settings


# ============================================================
# STATE
# ============================================================

@dataclass
class ResearchState:

    topic: str

    search_results: str = ""

    urls: List[str] = field(
        default_factory=list
    )

    scraped_sources: List[str] = field(
        default_factory=list
    )

    report: str = ""

    feedback: str = ""

    score: int = 0


# ============================================================
# URL EXTRACTION
# ============================================================

def extract_urls(
    text: str,
) -> List[str]:

    pattern = r"https?://[^\s\]\)>]+"

    urls = re.findall(
        pattern,
        text,
    )

    unique_urls = []

    for url in urls:

        url = url.rstrip(
            ".,;:)"
        )

        if url not in unique_urls:

            unique_urls.append(url)

    return unique_urls


# ============================================================
# SCORE EXTRACTION
# ============================================================

def extract_score(
    feedback: str,
) -> int:

    match = re.search(
        r"Score:\s*(\d+)",
        feedback,
        re.IGNORECASE,
    )

    if not match:
        return 0

    score = int(
        match.group(1)
    )

    return min(
        max(score, 0),
        10,
    )


# ============================================================
# SEARCH
# ============================================================

def run_search(
    state: ResearchState,
) -> ResearchState:

    search_agent = build_search_agent()

    result = search_agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": (
                        "Research the following topic "
                        "thoroughly using reliable sources:\n\n"
                        f"{state.topic}"
                    ),
                }
            ]
        }
    )

    messages = result.get(
        "messages",
        [],
    )

    if not messages:

        raise RuntimeError(
            "Search Agent returned no response."
        )

    state.search_results = (
        messages[-1].content
    )

    state.urls = extract_urls(
        state.search_results
    )

    state.urls = state.urls[
        :settings.MAX_SOURCES_TO_READ
    ]

    return state


# ============================================================
# READ SOURCES
# ============================================================

def run_reader(
    state: ResearchState,
) -> ResearchState:

    reader_agent = build_reader_agent()

    for url in state.urls:

        try:

            result = reader_agent.invoke(
                {
                    "messages": [
                        {
                            "role": "user",
                            "content": f"""
Analyze this source deeply.

Topic:
{state.topic}

URL:
{url}

Extract:

- Important facts
- Evidence
- Statistics
- Dates
- Arguments
- Limitations

Do not invent information.
""",
                        }
                    ]
                }
            )

            messages = result.get(
                "messages",
                [],
            )

            if not messages:
                continue

            content = messages[
                -1
            ].content

            state.scraped_sources.append(
                f"""
SOURCE URL:
{url}

SOURCE ANALYSIS:
{content}
""".strip()
            )

        except Exception as exc:

            state.scraped_sources.append(
                f"""
SOURCE URL:
{url}

SOURCE STATUS:
Failed to read source.

ERROR:
{exc}
""".strip()
            )

    return state


# ============================================================
# WRITE
# ============================================================

def run_writer(
    state: ResearchState,
) -> ResearchState:

    research = f"""
SEARCH RESULTS:

{state.search_results}


DETAILED SOURCE ANALYSIS:

{"\n\n---\n\n".join(state.scraped_sources)}
"""

    state.report = writer_chain.invoke(
        {
            "topic": state.topic,
            "research": research,
        }
    )

    return state


# ============================================================
# CRITIC
# ============================================================

def run_critic(
    state: ResearchState,
) -> ResearchState:

    state.feedback = critic_chain.invoke(
        {
            "report": state.report,
        }
    )

    state.score = extract_score(
        state.feedback
    )

    return state


# ============================================================
# REVISION
# ============================================================

def run_revision(
    state: ResearchState,
) -> ResearchState:

    state.report = revision_chain.invoke(
        {
            "report": state.report,
            "feedback": state.feedback,
        }
    )

    return state


# ============================================================
# COMPLETE PIPELINE
# ============================================================

def run_research_pipeline(
    topic: str,
) -> dict:

    topic = topic.strip()

    if not topic:

        raise ValueError(
            "Research topic cannot be empty."
        )

    state = ResearchState(
        topic=topic
    )

    # Step 1
    state = run_search(
        state
    )

    # Step 2
    state = run_reader(
        state
    )

    # Step 3
    state = run_writer(
        state
    )

    # Step 4
    state = run_critic(
        state
    )

    # Step 5
    for _ in range(
        settings.MAX_REVISIONS
    ):

        if state.score >= 8:
            break

        state = run_revision(
            state
        )

        state = run_critic(
            state
        )

    return {
        "topic": state.topic,

        "sources": state.urls,

        "scraped_sources":
            state.scraped_sources,

        "report":
            state.report,

        "feedback":
            state.feedback,

        "score":
            state.score,
    }