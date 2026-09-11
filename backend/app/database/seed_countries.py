import sys
import os
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.database.session import SessionLocal, engine, Base
from app.models.country import Country, Region, IndicatorSource
from app.models.indicator import EconomicIndicator, PoliticalIndicator, SocialIndicator, BusinessIndicator

def seed_countries_and_data():
    """Seed sovereign country records and baseline macroeconomic data across 45 countries."""
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Regions
        regions_data = [
            {"name": "North America", "code": "NA", "description": "Northern American continent"},
            {"name": "Europe", "code": "EU", "description": "European continent and Nordic nations"},
            {"name": "Asia Pacific", "code": "APAC", "description": "East, South, and Southeast Asia plus Oceania"},
            {"name": "Latin America", "code": "LATAM", "description": "Central & South America and Caribbean"},
            {"name": "Middle East & North Africa", "code": "MENA", "description": "Middle Eastern and North African nations"},
            {"name": "Sub-Saharan Africa", "code": "SSA", "description": "Sub-Saharan African continent"},
        ]

        region_map = {}
        for r_data in regions_data:
            r = db.query(Region).filter_by(code=r_data["code"]).first()
            if not r:
                r = Region(**r_data)
                db.add(r)
                db.flush()
            region_map[r_data["name"]] = r

        # 2. Indicator Sources
        sources_data = [
            {"name": "World Bank Open Data", "code": "worldbank", "base_url": "https://api.worldbank.org/v2"},
            {"name": "International Monetary Fund", "code": "imf", "base_url": "http://dataservices.imf.org"},
            {"name": "Trading Economics API", "code": "tradingeconomics", "base_url": "https://api.tradingeconomics.com"},
            {"name": "OECD Data", "code": "oecd", "base_url": "https://stats.oecd.org/SDMX-JSON/data"},
        ]
        for s_data in sources_data:
            s = db.query(IndicatorSource).filter_by(code=s_data["code"]).first()
            if not s:
                db.add(IndicatorSource(**s_data))

        # 3. 45 Major Sovereign Countries
        countries_list = [
            {"name": "United States", "iso_code": "USA", "iso_alpha2": "US", "region": "North America", "continent": "North America", "capital": "Washington, D.C.", "population": 331900000, "currency_code": "USD", "currency_name": "US Dollar", "flag_url": "🇺🇸", "latitude": 37.0902, "longitude": -95.7129},
            {"name": "Germany", "iso_code": "DEU", "iso_alpha2": "DE", "region": "Europe", "continent": "Europe", "capital": "Berlin", "population": 83200000, "currency_code": "EUR", "currency_name": "Euro", "flag_url": "🇩🇪", "latitude": 51.1657, "longitude": 10.4515},
            {"name": "United Kingdom", "iso_code": "GBR", "iso_alpha2": "GB", "region": "Europe", "continent": "Europe", "capital": "London", "population": 67300000, "currency_code": "GBP", "currency_name": "British Pound", "flag_url": "🇬🇧", "latitude": 55.3781, "longitude": -3.4360},
            {"name": "Japan", "iso_code": "JPN", "iso_alpha2": "JP", "region": "Asia Pacific", "continent": "Asia", "capital": "Tokyo", "population": 125700000, "currency_code": "JPY", "currency_name": "Japanese Yen", "flag_url": "🇯🇵", "latitude": 36.2048, "longitude": 138.2529},
            {"name": "India", "iso_code": "IND", "iso_alpha2": "IN", "region": "Asia Pacific", "continent": "Asia", "capital": "New Delhi", "population": 1417000000, "currency_code": "INR", "currency_name": "Indian Rupee", "flag_url": "🇮🇳", "latitude": 20.5937, "longitude": 78.9629},
            {"name": "Brazil", "iso_code": "BRA", "iso_alpha2": "BR", "region": "Latin America", "continent": "South America", "capital": "Brasília", "population": 214300000, "currency_code": "BRL", "currency_name": "Brazilian Real", "flag_url": "🇧🇷", "latitude": -14.2350, "longitude": -51.9253},
            {"name": "Singapore", "iso_code": "SGP", "iso_alpha2": "SG", "region": "Asia Pacific", "continent": "Asia", "capital": "Singapore", "population": 5637000, "currency_code": "SGD", "currency_name": "Singapore Dollar", "flag_url": "🇸🇬", "latitude": 1.3521, "longitude": 103.8198},
            {"name": "South Africa", "iso_code": "ZAF", "iso_alpha2": "ZA", "region": "Sub-Saharan Africa", "continent": "Africa", "capital": "Pretoria", "population": 59310000, "currency_code": "ZAR", "currency_name": "South African Rand", "flag_url": "🇿🇦", "latitude": -30.5595, "longitude": 22.9375},
            {"name": "Saudi Arabia", "iso_code": "SAU", "iso_alpha2": "SA", "region": "Middle East & North Africa", "continent": "Asia", "capital": "Riyadh", "population": 35950000, "currency_code": "SAR", "currency_name": "Saudi Riyal", "flag_url": "🇸🇦", "latitude": 23.8859, "longitude": 45.0792},
            {"name": "Ukraine", "iso_code": "UKR", "iso_alpha2": "UA", "region": "Europe", "continent": "Europe", "capital": "Kyiv", "population": 43800000, "currency_code": "UAH", "currency_name": "Ukrainian Hryvnia", "flag_url": "🇺🇦", "latitude": 48.3794, "longitude": 31.1656},
            {"name": "France", "iso_code": "FRA", "iso_alpha2": "FR", "region": "Europe", "continent": "Europe", "capital": "Paris", "population": 67750000, "currency_code": "EUR", "currency_name": "Euro", "flag_url": "🇫🇷", "latitude": 46.2276, "longitude": 2.2137},
            {"name": "Italy", "iso_code": "ITA", "iso_alpha2": "IT", "region": "Europe", "continent": "Europe", "capital": "Rome", "population": 59110000, "currency_code": "EUR", "currency_name": "Euro", "flag_url": "🇮🇹", "latitude": 41.8719, "longitude": 12.5674},
            {"name": "Canada", "iso_code": "CAN", "iso_alpha2": "CA", "region": "North America", "continent": "North America", "capital": "Ottawa", "population": 38250000, "currency_code": "CAD", "currency_name": "Canadian Dollar", "flag_url": "🇨🇦", "latitude": 56.1304, "longitude": -106.3468},
            {"name": "Australia", "iso_code": "AUS", "iso_alpha2": "AU", "region": "Asia Pacific", "continent": "Oceania", "capital": "Canberra", "population": 25690000, "currency_code": "AUD", "currency_name": "Australian Dollar", "flag_url": "🇦🇺", "latitude": -25.2744, "longitude": 133.7751},
            {"name": "China", "iso_code": "CHN", "iso_alpha2": "CN", "region": "Asia Pacific", "continent": "Asia", "capital": "Beijing", "population": 1412000000, "currency_code": "CNY", "currency_name": "Chinese Yuan", "flag_url": "🇨🇳", "latitude": 35.8617, "longitude": 104.1954},
            {"name": "South Korea", "iso_code": "KOR", "iso_alpha2": "KR", "region": "Asia Pacific", "continent": "Asia", "capital": "Seoul", "population": 51740000, "currency_code": "KRW", "currency_name": "South Korean Won", "flag_url": "🇰🇷", "latitude": 35.9078, "longitude": 127.7669},
            {"name": "Mexico", "iso_code": "MEX", "iso_alpha2": "MX", "region": "Latin America", "continent": "North America", "capital": "Mexico City", "population": 126700000, "currency_code": "MXN", "currency_name": "Mexican Peso", "flag_url": "🇲🇽", "latitude": 23.6345, "longitude": -102.5528},
            {"name": "Argentina", "iso_code": "ARG", "iso_alpha2": "AR", "region": "Latin America", "continent": "South America", "capital": "Buenos Aires", "population": 45810000, "currency_code": "ARS", "currency_name": "Argentine Peso", "flag_url": "🇦🇷", "latitude": -38.4161, "longitude": -63.6167},
            {"name": "Colombia", "iso_code": "COL", "iso_alpha2": "CO", "region": "Latin America", "continent": "South America", "capital": "Bogotá", "population": 51520000, "currency_code": "COP", "currency_name": "Colombian Peso", "flag_url": "🇨🇴", "latitude": 4.5709, "longitude": -74.2973},
            {"name": "Chile", "iso_code": "CHL", "iso_alpha2": "CL", "region": "Latin America", "continent": "South America", "capital": "Santiago", "population": 19490000, "currency_code": "CLP", "currency_name": "Chilean Peso", "flag_url": "🇨🇱", "latitude": -35.6751, "longitude": -71.5430},
            {"name": "Egypt", "iso_code": "EGY", "iso_alpha2": "EG", "region": "Middle East & North Africa", "continent": "Africa", "capital": "Cairo", "population": 109300000, "currency_code": "EGP", "currency_name": "Egyptian Pound", "flag_url": "🇪🇬", "latitude": 26.8206, "longitude": 30.8025},
            {"name": "Nigeria", "iso_code": "NGA", "iso_alpha2": "NG", "region": "Sub-Saharan Africa", "continent": "Africa", "capital": "Abuja", "population": 218500000, "currency_code": "NGN", "currency_name": "Nigerian Naira", "flag_url": "🇳🇬", "latitude": 9.0820, "longitude": 8.6753},
            {"name": "Kenya", "iso_code": "KEN", "iso_alpha2": "KE", "region": "Sub-Saharan Africa", "continent": "Africa", "capital": "Nairobi", "population": 53010000, "currency_code": "KES", "currency_name": "Kenyan Shilling", "flag_url": "🇰🇪", "latitude": -1.2921, "longitude": 36.8219},
            {"name": "United Arab Emirates", "iso_code": "ARE", "iso_alpha2": "AE", "region": "Middle East & North Africa", "continent": "Asia", "capital": "Abu Dhabi", "population": 9365000, "currency_code": "AED", "currency_name": "UAE Dirham", "flag_url": "🇦🇪", "latitude": 23.4241, "longitude": 53.8478},
            {"name": "Turkey", "iso_code": "TUR", "iso_alpha2": "TR", "region": "Middle East & North Africa", "continent": "Asia", "capital": "Ankara", "population": 84780000, "currency_code": "TRY", "currency_name": "Turkish Lira", "flag_url": "🇹🇷", "latitude": 38.9637, "longitude": 35.2433},
            {"name": "Israel", "iso_code": "ISR", "iso_alpha2": "IL", "region": "Middle East & North Africa", "continent": "Asia", "capital": "Jerusalem", "population": 9364000, "currency_code": "ILS", "currency_name": "Israeli Shekel", "flag_url": "🇮🇱", "latitude": 31.0461, "longitude": 34.8516},
            {"name": "Poland", "iso_code": "POL", "iso_alpha2": "PL", "region": "Europe", "continent": "Europe", "capital": "Warsaw", "population": 37750000, "currency_code": "PLN", "currency_name": "Polish Zloty", "flag_url": "🇵🇱", "latitude": 51.9194, "longitude": 19.1451},
            {"name": "Netherlands", "iso_code": "NLD", "iso_alpha2": "NL", "region": "Europe", "continent": "Europe", "capital": "Amsterdam", "population": 17530000, "currency_code": "EUR", "currency_name": "Euro", "flag_url": "🇳🇱", "latitude": 52.1326, "longitude": 5.2913},
            {"name": "Sweden", "iso_code": "SWE", "iso_alpha2": "SE", "region": "Europe", "continent": "Europe", "capital": "Stockholm", "population": 10420000, "currency_code": "SEK", "currency_name": "Swedish Krona", "flag_url": "🇸🇪", "latitude": 60.1282, "longitude": 18.6435},
            {"name": "Switzerland", "iso_code": "CHE", "iso_alpha2": "CH", "region": "Europe", "continent": "Europe", "capital": "Bern", "population": 8703000, "currency_code": "CHF", "currency_name": "Swiss Franc", "flag_url": "🇨🇭", "latitude": 46.8182, "longitude": 8.2275},
            {"name": "Spain", "iso_code": "ESP", "iso_alpha2": "ES", "region": "Europe", "continent": "Europe", "capital": "Madrid", "population": 47420000, "currency_code": "EUR", "currency_name": "Euro", "flag_url": "🇪🇸", "latitude": 40.4637, "longitude": -3.7492},
            {"name": "Norway", "iso_code": "NOR", "iso_alpha2": "NO", "region": "Europe", "continent": "Europe", "capital": "Oslo", "population": 5408000, "currency_code": "NOK", "currency_name": "Norwegian Krone", "flag_url": "🇳🇴", "latitude": 60.4720, "longitude": 8.4689},
            {"name": "Denmark", "iso_code": "DNK", "iso_alpha2": "DK", "region": "Europe", "continent": "Europe", "capital": "Copenhagen", "population": 5857000, "currency_code": "DKK", "currency_name": "Danish Krone", "flag_url": "🇩🇰", "latitude": 56.2639, "longitude": 9.5018},
            {"name": "Indonesia", "iso_code": "IDN", "iso_alpha2": "ID", "region": "Asia Pacific", "continent": "Asia", "capital": "Jakarta", "population": 273800000, "currency_code": "IDR", "currency_name": "Indonesian Rupiah", "flag_url": "🇮🇩", "latitude": -0.7893, "longitude": 113.9213},
            {"name": "Malaysia", "iso_code": "MYS", "iso_alpha2": "MY", "region": "Asia Pacific", "continent": "Asia", "capital": "Kuala Lumpur", "population": 32700000, "currency_code": "MYR", "currency_name": "Malaysian Ringgit", "flag_url": "🇲🇾", "latitude": 4.2105, "longitude": 101.9758},
            {"name": "Thailand", "iso_code": "THA", "iso_alpha2": "TH", "region": "Asia Pacific", "continent": "Asia", "capital": "Bangkok", "population": 71600000, "currency_code": "THB", "currency_name": "Thai Baht", "flag_url": "🇹🇭", "latitude": 15.8700, "longitude": 100.9925},
            {"name": "Vietnam", "iso_code": "VNM", "iso_alpha2": "VN", "region": "Asia Pacific", "continent": "Asia", "capital": "Hanoi", "population": 97470000, "currency_code": "VND", "currency_name": "Vietnamese Dong", "flag_url": "🇻🇳", "latitude": 14.0583, "longitude": 108.2772},
            {"name": "Philippines", "iso_code": "PHL", "iso_alpha2": "PH", "region": "Asia Pacific", "continent": "Asia", "capital": "Manila", "population": 113900000, "currency_code": "PHP", "currency_name": "Philippine Peso", "flag_url": "🇵🇭", "latitude": 12.8797, "longitude": 121.7740},
            {"name": "New Zealand", "iso_code": "NZL", "iso_alpha2": "NZ", "region": "Asia Pacific", "continent": "Oceania", "capital": "Wellington", "population": 5123000, "currency_code": "NZD", "currency_name": "New Zealand Dollar", "flag_url": "🇳🇿", "latitude": -40.9006, "longitude": 174.8860},
            {"name": "Pakistan", "iso_code": "PAK", "iso_alpha2": "PK", "region": "Asia Pacific", "continent": "Asia", "capital": "Islamabad", "population": 231400000, "currency_code": "PKR", "currency_name": "Pakistani Rupee", "flag_url": "🇵🇰", "latitude": 30.3753, "longitude": 69.3451},
            {"name": "Bangladesh", "iso_code": "BGD", "iso_alpha2": "BD", "region": "Asia Pacific", "continent": "Asia", "capital": "Dhaka", "population": 169400000, "currency_code": "BDT", "currency_name": "Bangladeshi Taka", "flag_url": "🇧🇩", "latitude": 23.6850, "longitude": 90.3563},
            {"name": "Greece", "iso_code": "GRC", "iso_alpha2": "GR", "region": "Europe", "continent": "Europe", "capital": "Athens", "population": 10640000, "currency_code": "EUR", "currency_name": "Euro", "flag_url": "🇬🇷", "latitude": 39.0742, "longitude": 21.8243},
            {"name": "Portugal", "iso_code": "PRT", "iso_alpha2": "PT", "region": "Europe", "continent": "Europe", "capital": "Lisbon", "population": 10330000, "currency_code": "EUR", "currency_name": "Euro", "flag_url": "🇵🇹", "latitude": 39.3999, "longitude": -8.2245},
            {"name": "Zimbabwe", "iso_code": "ZWE", "iso_alpha2": "ZW", "region": "Sub-Saharan Africa", "continent": "Africa", "capital": "Harare", "population": 15990000, "currency_code": "ZWL", "currency_name": "Zimbabwean Dollar", "flag_url": "🇿🇼", "latitude": -19.0154, "longitude": 29.1549},
            {"name": "Iran", "iso_code": "IRN", "iso_alpha2": "IR", "region": "Middle East & North Africa", "continent": "Asia", "capital": "Tehran", "population": 87920000, "currency_code": "IRR", "currency_name": "Iranian Rial", "flag_url": "🇮🇷", "latitude": 32.4279, "longitude": 53.6880},
        ]

        country_map = {}
        for c_data in countries_list:
            c = db.query(Country).filter_by(iso_code=c_data["iso_code"]).first()
            if not c:
                reg_obj = region_map.get(c_data["region"])
                c = Country(
                    name=c_data["name"],
                    iso_code=c_data["iso_code"],
                    iso_alpha2=c_data["iso_alpha2"],
                    region=c_data["region"],
                    region_id=reg_obj.id if reg_obj else None,
                    continent=c_data["continent"],
                    capital=c_data["capital"],
                    population=c_data["population"],
                    currency_code=c_data["currency_code"],
                    currency_name=c_data["currency_name"],
                    flag_url=c_data["flag_url"],
                    latitude=c_data["latitude"],
                    longitude=c_data["longitude"]
                )
                db.add(c)
                db.flush()
            country_map[c.iso_code] = c

        # 4. Seed Historical & Macro Indicators for all 45 countries (2021 to 2024)
        import random
        random.seed(42) # Deterministic data seeding

        for c_iso, c_obj in country_map.items():
            # Base parameters according to country profile
            base_gdp = c_obj.population * random.uniform(2000, 65000)
            base_growth = random.uniform(-2.0, 7.5)
            base_inf = random.uniform(1.2, 14.0)
            base_pol = random.uniform(25.0, 95.0)
            base_unemp = random.uniform(2.5, 18.0)

            for year in range(2021, 2025):
                # Economic Indicator
                existing_econ = db.query(EconomicIndicator).filter_by(country_id=c_obj.id, year=year).first()
                if not existing_econ:
                    db.add(EconomicIndicator(
                        country_id=c_obj.id,
                        year=year,
                        gdp_usd=round(base_gdp * (1.0 + (year - 2021) * 0.03), 2),
                        gdp_growth_pct=round(base_growth + random.uniform(-1.0, 1.0), 2),
                        inflation_pct=round(base_inf + random.uniform(-0.8, 0.8), 2),
                        unemployment_pct=round(base_unemp + random.uniform(-0.4, 0.4), 2),
                        govt_debt_pct_gdp=round(random.uniform(20.0, 110.0), 2)
                    ))

                # Political Indicator
                existing_pol = db.query(PoliticalIndicator).filter_by(country_id=c_obj.id, year=year).first()
                if not existing_pol:
                    db.add(PoliticalIndicator(
                        country_id=c_obj.id,
                        year=year,
                        political_stability=round(base_pol + random.uniform(-2.0, 2.0), 2),
                        govt_effectiveness=round(random.uniform(30.0, 95.0), 2),
                        regulatory_quality=round(random.uniform(30.0, 95.0), 2),
                        rule_of_law=round(random.uniform(30.0, 95.0), 2),
                        control_of_corruption=round(random.uniform(20.0, 90.0), 2)
                    ))

                # Social & Business Indicators
                existing_soc = db.query(SocialIndicator).filter_by(country_id=c_obj.id, year=year).first()
                if not existing_soc:
                    db.add(SocialIndicator(
                        country_id=c_obj.id,
                        year=year,
                        hdi_score=round(random.uniform(0.55, 0.95), 3),
                        population_growth_pct=round(random.uniform(0.1, 2.5), 2),
                        life_expectancy_years=round(random.uniform(65.0, 85.0), 1)
                    ))

                existing_bus = db.query(BusinessIndicator).filter_by(country_id=c_obj.id, year=year).first()
                if not existing_bus:
                    db.add(BusinessIndicator(
                        country_id=c_obj.id,
                        year=year,
                        ease_of_business_rank=int(random.uniform(1, 150)),
                        corporate_tax_rate_pct=round(random.uniform(12.0, 35.0), 1),
                        startup_procedures_days=round(random.uniform(3.0, 45.0), 1)
                    ))

        db.commit()
        print("Sovereign countries (45 nations) and indicator seed database initialized successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding countries: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_countries_and_data()
