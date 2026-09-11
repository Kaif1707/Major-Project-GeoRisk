import pytest
from app.risk.normalizer import ScoreNormalizer
from app.risk.rankings import RankingEngine


def test_score_normalizer_direct():
    # Test MinMax scaling direct metric (e.g. inflation where higher raw value = higher risk)
    norm = ScoreNormalizer.normalize_minmax(
        raw_val=8.0, min_val=0.0, max_val=10.0, is_inverted=False
    )
    assert norm == 80.0


def test_score_normalizer_inverted():
    # Test MinMax scaling inverted metric (e.g. GDP growth where higher raw value = lower risk)
    norm = ScoreNormalizer.normalize_minmax(
        raw_val=8.0, min_val=0.0, max_val=10.0, is_inverted=True
    )
    assert norm == 20.0


def test_ranking_engine_ordering():
    scores = [
        {"country_id": "c1", "overall_score": 45.2, "region": "Asia"},
        {"country_id": "c2", "overall_score": 18.4, "region": "North America"},
        {"country_id": "c3", "overall_score": 84.7, "region": "Europe"},
    ]
    ranked = RankingEngine.compute_rankings(scores)

    # c2 (18.4) should be global rank 1 (safest)
    c2_rank = next(item for item in ranked if item["country_id"] == "c2")
    assert c2_rank["global_rank"] == 1

    # c3 (84.7) should be global rank 3 (highest risk)
    c3_rank = next(item for item in ranked if item["country_id"] == "c3")
    assert c3_rank["global_rank"] == 3
