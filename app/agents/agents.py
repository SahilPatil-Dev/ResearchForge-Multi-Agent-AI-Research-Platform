from langchain.agents import create_agent
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI

from app.agents.tools import (
    scrape_url,
    web_search,
)
from app.core.config import settings


# ============================================================
# MODEL
# ============================================================

llm = ChatMistralAI(
    model=settings.MISTRAL_MODEL,
    temperature=0,
    max_retries=2,
)


# ============================================================
# SEARCH AGENT
# ============================================================

def build_search_agent():

    return create_agent(
        model=llm,

        tools=[
            web_search
        ],

        system_prompt="""
You are the Search Agent of ResearchForge.

Your responsibility is to find reliable,
recent and relevant information about the
user's research topic.

Rules:

1. Search the web using the web_search tool.
2. Prefer authoritative and primary sources.
3. Find multiple independent sources.
4. Prefer recent information when appropriate.
5. Do not invent facts or URLs.
6. Return useful source titles and URLs.
7. Return enough information for the Reader Agent.
8. Do not write the final research report.
""",

        name="search_agent",
    )


# ============================================================
# READER AGENT
# ============================================================

def build_reader_agent():

    return create_agent(
        model=llm,

        tools=[
            scrape_url
        ],

        system_prompt="""
You are the Reader Agent of ResearchForge.

Your responsibility is to deeply analyze
research sources selected by the Search Agent.

Rules:

1. Use scrape_url to inspect the provided URL.
2. Extract important facts and evidence.
3. Preserve important statistics and dates.
4. Identify relevant claims and arguments.
5. Distinguish facts from opinions.
6. Identify limitations where possible.
7. Never invent information.
8. Do not write the final report.
""",

        name="reader_agent",
    )


# ============================================================
# WRITER CHAIN
# ============================================================

writer_prompt = ChatPromptTemplate.from_messages(
    [

        (
            "system",
            """
You are the Senior Research Writer
for ResearchForge.

Your task is to produce a professional,
fact-based research report.

Rules:

- Use only the supplied research material.
- Do not invent facts.
- Do not invent sources.
- Distinguish evidence from interpretation.
- Mention uncertainty when sources disagree.
- Use clear headings.
- Avoid unnecessary repetition.
- Include the URLs of sources used.
""",
        ),

        (
            "human",
            """
Research Topic:

{topic}


Research Material:

{research}


Write the final research report using:

# Introduction

Explain the topic and why it matters.


# Key Findings

Provide at least 3 substantial findings.

For each finding:

- Explain the point.
- Provide supporting evidence.
- Include relevant statistics or dates.


# Analysis

Explain the broader meaning
of the findings.


# Limitations

Mention limitations in the
available research.


# Conclusion

Provide a concise conclusion.


# Sources

List all source URLs used.

Do not fabricate sources.
""",
        ),

    ]
)


writer_chain = (
    writer_prompt
    | llm
    | StrOutputParser()
)


# ============================================================
# CRITIC
# ============================================================

critic_prompt = ChatPromptTemplate.from_messages(
    [

        (
            "system",
            """
You are the ResearchForge Quality Critic.

Strictly evaluate the research report.

Evaluate:

1. Accuracy
2. Evidence quality
3. Source quality
4. Completeness
5. Logical structure
6. Clarity
7. Unsupported claims
8. Repetition
""",
        ),

        (
            "human",
            """
Evaluate this research report:

{report}


Return exactly:

Score: X/10

Strengths:
- ...
- ...
- ...

Areas to Improve:
- ...
- ...
- ...

Critical Issues:
- ...

One line verdict:
...
""",
        ),

    ]
)


critic_chain = (
    critic_prompt
    | llm
    | StrOutputParser()
)


# ============================================================
# REVISION
# ============================================================

revision_prompt = ChatPromptTemplate.from_messages(
    [

        (
            "system",
            """
You are the Senior Research Editor
for ResearchForge.

Improve the report using the critic's feedback.

Rules:

- Do not invent facts.
- Do not invent sources.
- Preserve valid evidence.
- Fix unsupported claims.
- Improve clarity.
- Improve structure.
- Remove repetition.
- Keep the source list.
""",
        ),

        (
            "human",
            """
Original Report:

{report}


Critic Feedback:

{feedback}


Rewrite the report into a stronger
final version.

Use:

# Introduction

# Key Findings

# Analysis

# Limitations

# Conclusion

# Sources
""",
        ),

    ]
)


revision_chain = (
    revision_prompt
    | llm
    | StrOutputParser()
)