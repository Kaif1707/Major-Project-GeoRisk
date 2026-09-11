from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.response import StandardResponse
from app.schemas.watchlist import WatchlistResponse, WatchlistCreate, WatchlistUpdate, WatchlistCountryResponse
from app.services.watchlist_service import WatchlistService

router = APIRouter()


@router.get("", response_model=StandardResponse[List[WatchlistResponse]])
async def list_watchlists(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch all watchlists for the authenticated user."""
    wls = WatchlistService.get_user_watchlists(db, current_user.id)
    res = [WatchlistResponse.model_validate(w) for w in wls]
    return StandardResponse(status="success", message="Watchlists retrieved", data=res)


@router.post("", response_model=StandardResponse[WatchlistResponse])
async def create_watchlist(
    data: WatchlistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new user watchlist."""
    wl = WatchlistService.create_watchlist(db, current_user.id, data.name, data.description, data.is_pinned)
    res = WatchlistResponse.model_validate(wl)
    return StandardResponse(status="success", message="Watchlist created", data=res)


@router.post("/{watchlist_id}/countries", response_model=StandardResponse[WatchlistCountryResponse])
async def add_country(
    watchlist_id: str,
    country_code: str = Query(..., description="ISO alpha-3 country code"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a country to a watchlist."""
    try:
        item = WatchlistService.add_country_to_watchlist(db, watchlist_id, country_code)
        res = WatchlistCountryResponse.model_validate(item)
        return StandardResponse(status="success", message=f"Country {country_code} added to watchlist", data=res)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/{watchlist_id}/countries/{country_id}", response_model=StandardResponse[dict])
async def remove_country(
    watchlist_id: str,
    country_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a country from a watchlist."""
    success = WatchlistService.remove_country_from_watchlist(db, watchlist_id, country_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Watchlist item not found")
    return StandardResponse(status="success", message="Country removed from watchlist", data={"removed": True})
