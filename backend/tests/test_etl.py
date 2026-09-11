import pytest
from app.etl.validation import DataValidator
from app.etl.cleaner import DataCleaner


def test_data_validator_bounds():
    # Valid GDP growth within [-30%, +30%]
    is_valid, err = DataValidator.validate_metric("gdp_growth_pct", 4.5)
    assert is_valid is True

    # Invalid Inflation (+5000% outlier bound check)
    is_valid_outlier, err = DataValidator.validate_metric("inflation_pct", 9999.0)
    assert is_valid_outlier is False


def test_data_cleaner_imputation():
    series = [2.1, None, 3.5]
    cleaned = DataCleaner.impute_missing_values(series)
    assert cleaned[1] == 2.8 # Imputed average of adjacent values
