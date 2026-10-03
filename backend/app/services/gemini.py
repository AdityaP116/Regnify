"""
Gemini AI service for regulatory Q&A.

The service:
1. Retrieves relevant regulations from the seed corpus as context.
2. Builds a system-grounded prompt that clearly separates official source text
   from AI interpretation.
3. Calls the Gemini API and parses a structured JSON response.
4. Falls back to a deterministic seed response when Gemini is unconfigured or
   returns a malformed answer.
"""

from __future__ import annotations
import json
import logging
import time
from datetime import datetime

import google.generativeai as genai

from app.config import get_settings
from app.models import AiResponse, AiCitation, BusinessLogic, OperationalStep
from app.services.seed import get_corpus

logger = logging.getLogger(__name__)

_gemini_initialised = False


def _ensure_gemini() -> bool:
    global _gemini_initialised
    if _gemini_initialised:
        return True
    settings = get_settings()
    if not settings.gemini_configured:
        return False
    try:
        genai.configure(api_key=settings.gemini_api_key)
        _gemini_initialised = True
        return True
    except Exception as exc:
        logger.warning("[gemini] Init failed: %s", exc)
        return False


def _build_context(query: str) -> str:
    """Build a regulatory context string from the seed corpus."""
    corpus = get_corpus()
    regulations = corpus.get("regulations", [])
    business = corpus.get("businessProfile", {})

    # Pick regulations most likely relevant to the query (simple keyword match)
    query_lower = query.lower()
    scored: list[tuple[int, dict]] = []
    for reg in regulations:
        score = 0
        text = (reg.get("title", "") + " " + reg.get("summary", "") + " " + reg.get("category", "")).lower()
        for word in query_lower.split():
            if len(word) > 3 and word in text:
                score += 1
        scored.append((score, reg))

    scored.sort(key=lambda x: x[0], reverse=True)
    top_regs = [r for _, r in scored[:4]] or regulations[:4]

    context_parts = [
        f"Business Profile:",
        f"  Name: {business.get('name', 'Unknown')}",
        f"  Sector: {business.get('sector', '')}",
        f"  Jurisdiction: {business.get('jurisdiction', '')}",
        f"  Employees: {business.get('employees', 0)}",
        f"  Location: {business.get('location', '')}",
        f"  Pollution Category: {business.get('pollutionCategory', '')}",
        "",
        "Relevant Regulations:",
    ]

    for reg in top_regs:
        context_parts += [
            f"\n--- {reg.get('gazetteId', '')} ---",
            f"Title: {reg.get('title', '')}",
            f"Authority: {reg.get('authority', '')}",
            f"Category: {reg.get('category', '')}",
            f"Effective Date: {reg.get('effectiveDate', '')}",
            f"Summary: {reg.get('summary', '')}",
            f"Before: {reg.get('beforeChange', '')}",
            f"Now: {reg.get('nowChange', '')}",
            f"Impact: {reg.get('impactQuote', '')}",
        ]

    return "\n".join(context_parts)


_SYSTEM_PROMPT = """You are Regnify's regulatory intelligence assistant.
You answer questions about Indian government regulations using ONLY the provided official regulatory context.
You MUST distinguish between official statutory text and your interpretation.
You NEVER fabricate gazette numbers, clause references, or deadlines.
If the context does not contain an answer, clearly say so.

Always respond with valid JSON in exactly this schema:
{
  "executiveSynthesis": "<clear plain-English answer, 2-4 sentences>",
  "confidence": <integer 0-100>,
  "citations": [
    {
      "authority": "<regulator name>",
      "notification": "<gazette ID and clause>",
      "clause": "<specific clause>",
      "gazette": "<gazette date>",
      "excerpt": "<verbatim or close paraphrase from the context>",
      "pdfLabel": "View Official Notification",
      "verified": true
    }
  ],
  "operationalSteps": [
    {"step": 1, "title": "<action title>", "detail": "<what to do>"}
  ],
  "statutoryDeadline": "<deadline or 'See regulation for deadline'>",
  "suggestedQueries": ["<related question 1>", "<related question 2>", "<related question 3>"]
}"""


def ask_regulatory_question(query: str, business_name: str = "your enterprise") -> AiResponse:
    """
    Ask Gemini a regulatory question grounded in the corpus.
    Falls back to seed response if Gemini is unavailable or fails.
    """
    start = time.monotonic()

    if not _ensure_gemini():
        logger.info("[gemini] Not configured — returning seed AI response.")
        return _seed_fallback(query, business_name)

    context = _build_context(query)
    user_prompt = f"""Context (official regulatory data):
{context}

User question: {query}

Answer using ONLY the context above. Return valid JSON per the schema."""

    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=_SYSTEM_PROMPT,
        )
        response = model.generate_content(user_prompt)
        raw = response.text.strip()

        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        parsed = json.loads(raw)
        latency_ms = int((time.monotonic() - start) * 1000)

        corpus = get_corpus()
        business = corpus.get("businessProfile", {})

        return AiResponse(
            id=f"ai-{int(time.time())}",
            question=f'"{query}"',
            askedBy=business_name,
            askedAt=datetime.now().strftime("%I:%M %p"),
            confidence=parsed.get("confidence", 85),
            latencyMs=latency_ms,
            executiveSynthesis=parsed.get("executiveSynthesis", ""),
            businessLogic=BusinessLogic(
                targetEntity=business.get("name", "Your Enterprise"),
                matchedClause=parsed.get("citations", [{}])[0].get("clause", "") if parsed.get("citations") else "",
                nicCode="25920 (Metal Fab)",
                zone=business.get("location", ""),
                applicability="Mandatory (Level 1)" if parsed.get("confidence", 0) >= 75 else "Review Required",
            ),
            citations=[
                AiCitation(**c)
                for c in parsed.get("citations", [])
                if all(k in c for k in ("authority", "notification", "clause", "gazette", "excerpt", "pdfLabel", "verified"))
            ],
            operationalSteps=[
                OperationalStep(**s)
                for s in parsed.get("operationalSteps", [])
                if all(k in s for k in ("step", "title", "detail"))
            ],
            statutoryDeadline=parsed.get("statutoryDeadline", "See regulation"),
            suggestedQueries=parsed.get("suggestedQueries", _default_suggestions()),
        )

    except Exception as exc:
        logger.warning("[gemini] API call failed (%s) — using seed fallback.", exc)
        return _seed_fallback(query, business_name)


def _default_suggestions() -> list[str]:
    return [
        "What are the updated filing dates for Maharashtra Labour Welfare Fund?",
        "Explain the new CPCB real-time telemetry rules in simple terms.",
        "Show me all compliance deadlines due in the next 30 days.",
    ]


def _seed_fallback(query: str, business_name: str) -> AiResponse:
    """Return a deterministic response from the seed corpus."""
    corpus = get_corpus()
    seed = corpus.get("aiResponse", {})

    return AiResponse(
        id=seed.get("id", "ai-session-001"),
        question=f'"{query}"' if query else seed.get("question", ""),
        askedBy=business_name,
        askedAt=datetime.now().strftime("%I:%M %p"),
        confidence=seed.get("confidence", 94),
        latencyMs=seed.get("latencyMs", 412),
        executiveSynthesis=seed.get("executiveSynthesis", ""),
        businessLogic=BusinessLogic(**seed.get("businessLogic", {
            "targetEntity": "Your Enterprise",
            "matchedClause": "",
            "nicCode": "25920",
            "zone": "",
            "applicability": "Mandatory (Level 1)",
        })),
        citations=[AiCitation(**c) for c in seed.get("citations", [])],
        operationalSteps=[OperationalStep(**s) for s in seed.get("operationalSteps", [])],
        statutoryDeadline=seed.get("statutoryDeadline", ""),
        suggestedQueries=seed.get("suggestedQueries", _default_suggestions()),
    )
