from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from langchain.tools import tool
from tavily import TavilyClient

from app.core.config import settings


tavily = TavilyClient(
    api_key=settings.TAVILY_API_KEY
)


@tool
def web_search(query: str) -> str:
    """
    Search the web for recent and reliable information.

    Returns source titles, URLs, relevance scores,
    and content snippets.
    """

    if not query or not query.strip():
        return "Search failed: query cannot be empty."

    try:
        response = tavily.search(
            query=query.strip(),
            search_depth="advanced",
            max_results=settings.MAX_SEARCH_RESULTS,
            include_answer=False,
        )

        results = response.get("results", [])

        if not results:
            return "No relevant search results found."

        sources = []

        for index, result in enumerate(
            results,
            start=1,
        ):

            title = result.get(
                "title",
                "Unknown title",
            )

            url = result.get(
                "url",
                "",
            )

            content = result.get(
                "content",
                "",
            )

            score = result.get(
                "score",
                0,
            )

            sources.append(
                f"""
SOURCE {index}

Title:
{title}

URL:
{url}

Relevance Score:
{score}

Snippet:
{content[:500]}
""".strip()
            )

        return "\n\n".join(sources)

    except Exception as exc:

        return (
            f"Web search failed: {exc}"
        )


@tool
def scrape_url(url: str) -> str:
    """
    Fetch and extract readable text from a web page.

    Only HTTP and HTTPS URLs are allowed.
    """

    if not url:
        return (
            "Scraping failed: "
            "URL is empty."
        )

    try:

        parsed = urlparse(url)

        if parsed.scheme not in {
            "http",
            "https",
        }:

            return (
                "Scraping failed: "
                "only HTTP/HTTPS URLs "
                "are allowed."
            )

        response = requests.get(
            url,
            timeout=15,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 "
                    "(compatible; "
                    "ResearchForge/1.0)"
                )
            },
        )

        response.raise_for_status()

        soup = BeautifulSoup(
            response.text,
            "html.parser",
        )

        for tag in soup(
            [
                "script",
                "style",
                "nav",
                "footer",
                "header",
                "aside",
                "form",
                "noscript",
            ]
        ):
            tag.decompose()

        text = soup.get_text(
            separator=" ",
            strip=True,
        )

        if not text:

            return (
                "Scraping failed: "
                "no readable content found."
            )

        return text[
            :settings.MAX_SCRAPED_CHARS
        ]

    except requests.RequestException as exc:

        return (
            f"Scraping failed: "
            f"network error - {exc}"
        )

    except Exception as exc:

        return (
            f"Scraping failed: {exc}"
        )