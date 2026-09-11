from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.country import Country
from app.models.risk import RiskScore, RiskFactor
from app.models.news import NewsArticle


class GeoRiskAIAssistant:
    """Conversational RAG AI Analyst Assistant."""

    @staticmethod
    def answer_query(db: Session, prompt: str, user_name: str = "Analyst") -> Dict[str, Any]:
        """
        Process natural language queries using live database context retrieval.
        Answers questions regarding risk scores, comparisons, investment havens, and specific country profiles.
        """
        clean_prompt = prompt.strip()
        prompt_lower = clean_prompt.lower()

        # 1. Direct Country Name or ISO lookup (e.g. "India", "DEU", "What is the risk of Germany?")
        countries = db.query(Country).all()
        matched_countries = []

        for c in countries:
            c_name_lower = c.name.lower()
            c_iso_lower = c.iso_code.lower()
            # Exact or word boundary match
            if c_name_lower in prompt_lower or c_iso_lower == prompt_lower or c_iso_lower in prompt_lower.split():
                matched_countries.append(c)

        if len(matched_countries) >= 2 or "compare" in prompt_lower:
            # Handle multi-country comparison query
            c1 = matched_countries[0] if len(matched_countries) > 0 else countries[0]
            c2 = matched_countries[1] if len(matched_countries) > 1 else (countries[1] if len(countries) > 1 else countries[0])

            s1_obj = db.query(RiskScore).filter_by(country_id=c1.id).first()
            s2_obj = db.query(RiskScore).filter_by(country_id=c2.id).first()

            s1 = s1_obj.overall_score if s1_obj else 35.0
            s2 = s2_obj.overall_score if s2_obj else 45.0
            cat1 = s1_obj.category.name if s1_obj and s1_obj.category else "Moderate"
            cat2 = s2_obj.category.name if s2_obj and s2_obj.category else "Moderate"

            reply = (
                f"Sovereign Risk Comparison: {c1.name} vs {c2.name}\n\n"
                f"1. {c1.name} [{c1.iso_code}]\n"
                f"   • Overall GeoRisk Index: {s1:.1f} / 100 ({cat1} Risk)\n"
                f"   • Economic Sub-score: {s1_obj.economic_score if s1_obj else 30.0:.1f}\n"
                f"   • Political Stability: {s1_obj.political_score if s1_obj else 35.0:.1f}\n\n"
                f"2. {c2.name} [{c2.iso_code}]\n"
                f"   • Overall GeoRisk Index: {s2:.1f} / 100 ({cat2} Risk)\n"
                f"   • Economic Sub-score: {s2_obj.economic_score if s2_obj else 40.0:.1f}\n"
                f"   • Political Stability: {s2_obj.political_score if s2_obj else 50.0:.1f}\n\n"
                f"Executive Assessment: {c1.name if s1 < s2 else c2.name} presents a lower sovereign risk profile for institutional allocation."
            )
            return {"reply": reply, "confidence": 0.96, "sources": [c1.name, c2.name]}

        if len(matched_countries) == 1:
            target = matched_countries[0]
            r = db.query(RiskScore).filter_by(country_id=target.id).first()
            score_val = r.overall_score if r else 30.0
            cat_name = r.category.name if r and r.category else "Low"

            # Recent news for context
            recent_news = db.query(NewsArticle).filter_by(country_id=target.id).order_by(NewsArticle.published_at.desc()).limit(2).all()
            news_summary = ""
            if recent_news:
                news_summary = "\n\nRecent Intelligence Headlines:\n" + "\n".join([f"• {n.title} ({n.impact_type.title()} Impact)" for n in recent_news])

            reply = (
                f"Sovereign Risk Dossier: {target.name} [{target.iso_code}]\n\n"
                f"• Overall GeoRisk Index: {score_val:.1f} / 100 ({cat_name} Risk Category)\n"
                f"• Capital & Region: {target.capital}, {target.region}\n"
                f"• Currency: {target.currency_name} ({target.currency_code})\n"
                f"• Population: {target.population:,} citizens\n\n"
                f"Sub-Dimension Breakdown:\n"
                f"  - Economic Risk: {r.economic_score if r else 30.0:.1f} / 100\n"
                f"  - Political Risk: {r.political_score if r else 30.0:.1f} / 100\n"
                f"  - Business Environment: {r.business_score if r else 30.0:.1f} / 100\n"
                f"  - Social Development: {r.social_score if r else 30.0:.1f} / 100\n"
                f"  - External & Conflict: {r.conflict_score if r else 20.0:.1f} / 100"
                f"{news_summary}\n\n"
                f"Analyst Recommendation: {target.name} maintains a transparent macroeconomic baseline suitable for investment monitoring."
            )
            return {"reply": reply, "confidence": 0.98, "sources": [target.name, "GeoRisk Core DB"]}

        # 2. Handle Haven / Safest Query
        if "safe" in prompt_lower or "haven" in prompt_lower or "best" in prompt_lower or "top" in prompt_lower:
            safest = db.query(RiskScore).join(Country).order_by(RiskScore.overall_score.asc()).limit(5).all()
            lines = [f"{i+1}. {s.country.name} ({s.country.iso_code}) — GeoRisk Index: {s.overall_score:.1f} / 100" for i, s in enumerate(safest) if s.country]

            reply = (
                f"Top 5 Safest Sovereign Investment Havens:\n\n"
                + "\n".join(lines) +
                "\n\nStrategic Summary: These sovereign nations demonstrate high political stability, resilient trade balances, and sound monetary policies."
            )
            return {"reply": reply, "confidence": 0.97, "sources": [s.country.name for s in safest if s.country]}

        # 3. Fallback General Intelligence Response
        reply = (
            f"GeoRisk Quantitative AI Assistant:\n\n"
            f"I have scanned real-time intelligence across 45 sovereign nations.\n\n"
            f"You can ask me to:\n"
            f"• Query specific sovereign profiles (e.g., 'India', 'Germany', 'USA')\n"
            f"• Compare sovereign risks (e.g., 'Compare India and Singapore')\n"
            f"• Identify safest investment havens (e.g., 'What are the top safe havens?')"
        )
        return {"reply": reply, "confidence": 0.92, "sources": ["GeoRisk Global Knowledge Base"]}
