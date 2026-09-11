from typing import Optional


class ScoreNormalizer:
    """Normalization Layer: MinMax scaling & metric inversion handling."""

    @staticmethod
    def normalize_minmax(
        raw_val: Optional[float],
        min_val: float,
        max_val: float,
        is_inverted: bool = False,
        default_neutral: float = 50.0
    ) -> float:
        """
        MinMax normalize a raw metric value to a 0.0 - 100.0 risk scale.
        - If is_inverted is True: higher raw value = safer country (e.g. GDP growth, political stability).
          Normalizing inverts this so higher final score = higher risk.
        - If is_inverted is False: higher raw value = higher risk (e.g. inflation, corruption).
        """
        if raw_val is None:
            return default_neutral

        if max_val == min_val:
            return default_neutral

        # Clamp raw_val to range [min_val, max_val]
        clamped_val = max(min_val, min(max_val, raw_val))
        
        # MinMax scale [0, 1]
        scale_0_1 = (clamped_val - min_val) / (max_val - min_val)

        if is_inverted:
            # Safer -> lower risk score
            normalized = (1.0 - scale_0_1) * 100.0
        else:
            # Risky -> higher risk score
            normalized = scale_0_1 * 100.0

        return round(normalized, 2)
