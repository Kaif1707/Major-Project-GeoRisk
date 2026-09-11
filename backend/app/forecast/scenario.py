from typing import Dict, Any


class ScenarioSimulator:
    """What-If Scenario Simulation Engine: Calculates GeoRisk score shift under synthetic macro events."""

    @staticmethod
    def simulate_scenario(
        current_score: float,
        gdp_delta_pct: float = 0.0,
        inflation_delta_pct: float = 0.0,
        pol_instability_delta: float = 0.0,
        unemp_delta_pct: float = 0.0
    ) -> Dict[str, Any]:
        """
        Simulate impact of what-if parameter changes on overall GeoRisk score.
        - GDP Growth surge (- risk)
        - Inflation increase (+ risk)
        - Political Instability increase (+ risk)
        - Unemployment increase (+ risk)
        """
        # Economic Dimension Weight Impact (30% total weight)
        gdp_impact = - (gdp_delta_pct * 1.5)        # Higher GDP growth reduces risk
        inflation_impact = (inflation_delta_pct * 1.2) # Higher inflation increases risk
        
        # Political Dimension Weight Impact (25% total weight)
        pol_impact = (pol_instability_delta * 0.25)

        # Conflict/Social Impact (10% total weight)
        unemp_impact = (unemp_delta_pct * 0.8)

        total_delta = gdp_impact + inflation_impact + pol_impact + unemp_impact
        predicted_score = max(0.0, min(100.0, current_score + total_delta))
        score_delta = round(predicted_score - current_score, 2)

        # Map new Category
        if predicted_score <= 20.0:
            category = "Very Low Risk"
        elif predicted_score <= 35.0:
            category = "Low Risk"
        elif predicted_score <= 50.0:
            category = "Moderate Risk"
        elif predicted_score <= 65.0:
            category = "Elevated Risk"
        elif predicted_score <= 80.0:
            category = "High Risk"
        else:
            category = "Extreme Risk"

        return {
            "original_score": current_score,
            "predicted_score": round(predicted_score, 2),
            "score_delta": score_delta,
            "predicted_category": category,
            "affected_dimensions": ["Economic", "Political", "Social"]
        }
