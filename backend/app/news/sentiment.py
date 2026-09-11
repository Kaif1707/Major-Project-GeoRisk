from typing import Tuple, List


class SentimentAnalyzer:
    """NLP Rule-based Sentiment Analyzer & Keyword Extractor."""

    POSITIVE_WORDS = ["growth", "surge", "stability", "profit", "agreement", "recovery", "peace", "expansion", "record", "boom", "gain"]
    NEGATIVE_WORDS = ["war", "conflict", "sanction", "inflation", "recession", "crisis", "strike", "escalation", "default", "tension", "drop"]

    @classmethod
    def analyze_text(cls, text: str) -> Tuple[float, str, List[str]]:
        """
        Analyze sentiment score (-1.0 to +1.0), sentiment label, and keywords.
        """
        if not text:
            return 0.0, "Neutral", []

        words = text.lower().split()
        pos_count = sum(1 for w in words if any(p in w for p in cls.POSITIVE_WORDS))
        neg_count = sum(1 for w in words if any(n in w for n in cls.NEGATIVE_WORDS))

        total_keywords = pos_count + neg_count
        if total_keywords == 0:
            return 0.0, "Neutral", []

        score = (pos_count - neg_count) / float(total_keywords)

        if score > 0.3:
            label = "Positive"
        elif score > 0.6:
            label = "Very Positive"
        elif score < -0.3:
            label = "Negative"
        elif score < -0.6:
            label = "Very Negative"
        else:
            label = "Neutral"

        found_keywords = [w for w in words if any(k in w for k in cls.POSITIVE_WORDS + cls.NEGATIVE_WORDS)]
        return round(score, 2), label, list(set(found_keywords))[:5]
