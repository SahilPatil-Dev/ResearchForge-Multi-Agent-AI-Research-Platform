import re
from dataclasses import dataclass, field
from typing import Any

from app.agents.agents import (
    build_reader_agent,
    build_search_agent,
    critic_chain,
    revision_chain,
    writer_chain,
)
from app.core.config import settings


@dataclass
class ResearchState:
    topic: str
    search_results: str = ""
    urls: list[str] = field(default_factory=list)
    scraped_sources: list[str] = field(default_factory=list)
    report: str = ""
    feedback: str = ""
    score: int = 0


def normalize_content(content: Any) -> str:
    if content is None:
        return ""

    if isinstance(content, str):
        return content

    if isinstance(content, list):
        parts: list[str] = []

        for item in content:
            if isinstance(item, str):
                parts.append(item)
                continue

            if isinstance(item, dict):
                text = item.get("text")

                if isinstance(text, str):
                    parts.append(text)
                    continue

                item_content = item.get("content")

                if isinstance(item_content, str):
                    parts.append(item_content)

                continue

            text = getattr(item, "text", None)

            if isinstance(text, str):
                parts.append(text)
                continue

            item_content = getattr(
                item,
                "content",
                None,
            )

            if isinstance(item_content, str):
                parts.append(item_content)

        return "\n".join(parts)

    return str(content)


def extract_urls(text: Any) -> list[str]:
    text = normalize_content(text)

    if not text:
        return []

    pattern = r"https?://[^\s\]\[<>\")']+"

    urls = re.findall(
        pattern,
        text,
    )

    unique_urls: list[str] = []

    for url in urls:
        url = url.rstrip(
            ".,;:!?)]}>"
        )

        if url not in unique_urls:
            unique_urls.append(url)

    return unique_urls


def extract_score(feedback: Any) -> int:
    feedback = normalize_content(feedback)

    if not feedback:
        return 0

    match = re.search(
        r"Score\s*:\s*(\d+)",
        feedback,
        re.IGNORECASE,
    )

    if not match:
        return 0

    try:
        score = int(match.group(1))
    except ValueError:
        return 0

    return max(
        0,
        min(score, 10),
    )


def get_last_message_content(result: dict) -> str:
    messages = result.get("messages", [])

    if not messages:
        raise RuntimeError(
            "Agent returned no messages."
        )

    content = getattr(
        messages[-1],
        "content",
        None,
    )

    content = normalize_content(content)

    if not content.strip():
        raise RuntimeError(
            "Agent returned an empty response."
        )

    return content


def run_search(
    state: ResearchState,
) -> ResearchState:

    search_agent = build_search_agent()

    prompt = f"""
Research the following topic thoroughly:

{state.topic}

Find recent, reliable and relevant information.

Requirements:
1. Search the web.
2. Prefer authoritative sources.
3. Find multiple independent sources.
4. Prefer recent information.
5. Return source titles.
6. Return source URLs.
7. Summarize important information.
8. Do not invent sources.
"""

    try:
        result = search_agent.invoke(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ]
            }
        )

    except Exception as exc:
        raise RuntimeError(
            f"Search Agent failed: {exc}"
        ) from exc

    state.search_results = (
        get_last_message_content(result)
    )

    state.urls = extract_urls(
        state.search_results
    )

    state.urls = state.urls[
        :settings.MAX_SOURCES_TO_READ
    ]

    return state


def run_reader(
    state: ResearchState,
) -> ResearchState:

    if not state.urls:
        return state

    reader_agent = build_reader_agent()

    for url in state.urls:

        prompt = f"""
Analyze this research source:

URL:
{url}

Research Topic:
{state.topic}

Use the scrape_url tool to read the page.

Extract:
- Important facts
- Key evidence
- Statistics
- Dates
- Important arguments
- Relevant findings
- Limitations
- Information specifically relevant to India

Rules:
1. Do not invent information.
2. Only use information found in the source.
3. Clearly identify important evidence.
4. Do not write the final report.
"""

        try:
            result = reader_agent.invoke(
                {
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt,
                        }
                    ]
                }
            )

            content = (
                get_last_message_content(
                    result
                )
            )

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
FAILED

ERROR:
{exc}
""".strip()
            )

    return state


def run_writer(
    state: ResearchState,
) -> ResearchState:

    if not state.search_results:
        raise RuntimeError(
            "Cannot write report: "
            "search results are empty."
        )

    detailed_sources = (
        "\n\n--- SOURCE SEPARATOR ---\n\n"
        .join(
            state.scraped_sources
        )
    )

    research = f"""
SEARCH RESULTS:

{state.search_results}


DETAILED SOURCE ANALYSIS:

{detailed_sources}
"""

    try:
        report = writer_chain.invoke(
            {
                "topic": state.topic,
                "research": research,
            }
        )

    except Exception as exc:
        raise RuntimeError(
            f"Writer failed: {exc}"
        ) from exc

    state.report = normalize_content(
        report
    )

    if not state.report.strip():
        raise RuntimeError(
            "Writer returned an empty report."
        )

    return state


def run_critic(
    state: ResearchState,
) -> ResearchState:

    if not state.report:
        raise RuntimeError(
            "Cannot run critic: "
            "report is empty."
        )

    try:
        feedback = critic_chain.invoke(
            {
                "report": state.report,
            }
        )

    except Exception as exc:
        raise RuntimeError(
            f"Critic failed: {exc}"
        ) from exc

    state.feedback = normalize_content(
        feedback
    )

    state.score = extract_score(
        state.feedback
    )

    return state


def run_revision(
    state: ResearchState,
) -> ResearchState:

    if not state.report:
        raise RuntimeError(
            "Cannot revise: "
            "report is empty."
        )

    if not state.feedback:
        raise RuntimeError(
            "Cannot revise: "
            "critic feedback is empty."
        )

    try:
        revised_report = (
            revision_chain.invoke(
                {
                    "report": state.report,
                    "feedback": state.feedback,
                }
            )
        )

    except Exception as exc:
        raise RuntimeError(
            f"Revision failed: {exc}"
        ) from exc

    state.report = normalize_content(
        revised_report
    )

    if not state.report.strip():
        raise RuntimeError(
            "Revision returned an empty report."
        )

    return state


def run_research_pipeline(
    topic: str,
) -> dict:

    if not isinstance(topic, str):
        raise ValueError(
            "Research topic must be a string."
        )

    topic = topic.strip()

    if not topic:
        raise ValueError(
            "Research topic cannot be empty."
        )

    state = ResearchState(
        topic=topic
    )

    try:
        state = run_search(state)

        state = run_reader(state)

        state = run_writer(state)

        state = run_critic(state)

        max_revisions = max(
            0,
            settings.MAX_REVISIONS,
        )

        for _ in range(max_revisions):

            if state.score >= 8:
                break

            state = run_revision(state)

            state = run_critic(state)

        return {
            "topic": state.topic,
            "sources": state.urls,
            "scraped_sources": state.scraped_sources,
            "report": state.report,
            "feedback": state.feedback,
            "score": state.score,
        }

    except Exception as exc:
        raise RuntimeError(
            f"Research pipeline failed: {exc}"
        ) from exc