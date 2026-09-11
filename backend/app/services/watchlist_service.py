from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.watchlist import Watchlist, WatchlistCountry
from app.models.country import Country
from app.services.country_service import CountryService


class WatchlistService:
    @staticmethod
    def get_user_watchlists(db: Session, user_id: str) -> List[Watchlist]:
        """Fetch all watchlists for a user."""
        return db.query(Watchlist).filter_by(user_id=user_id, is_archived=False).order_by(Watchlist.is_pinned.desc(), Watchlist.updated_at.desc()).all()

    @staticmethod
    def create_watchlist(db: Session, user_id: str, name: str, description: Optional[str] = None, is_pinned: bool = False) -> Watchlist:
        """Create a new user watchlist."""
        wl = Watchlist(user_id=user_id, name=name, description=description, is_pinned=is_pinned)
        db.add(wl)
        db.commit()
        db.refresh(wl)
        return wl

    @staticmethod
    def add_country_to_watchlist(db: Session, watchlist_id: str, country_code: str) -> WatchlistCountry:
        """Add a country to a watchlist."""
        country = CountryService.get_country_by_id_or_code(db, country_code)
        if not country:
            raise ValueError(f"Country {country_code} not found")

        item = db.query(WatchlistCountry).filter_by(watchlist_id=watchlist_id, country_id=country.id).first()
        if not item:
            item = WatchlistCountry(watchlist_id=watchlist_id, country_id=country.id)
            db.add(item)
            db.commit()
            db.refresh(item)
        return item

    @staticmethod
    def remove_country_from_watchlist(db: Session, watchlist_id: str, country_id: str) -> bool:
        """Remove a country from a watchlist."""
        item = db.query(WatchlistCountry).filter_by(watchlist_id=watchlist_id, country_id=country_id).first()
        if item:
            db.delete(item)
            db.commit()
            return True
        return False
