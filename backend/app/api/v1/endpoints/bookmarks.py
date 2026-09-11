from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.response import StandardResponse
from app.schemas.bookmark import BookmarkResponse, BookmarkCreate
from app.services.bookmark_service import BookmarkService

router = APIRouter()


@router.get("", response_model=StandardResponse[List[BookmarkResponse]])
async def list_bookmarks(
    item_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch user bookmarks."""
    bms = BookmarkService.get_user_bookmarks(db, current_user.id, item_type=item_type)
    res = [BookmarkResponse.model_validate(b) for b in bms]
    return StandardResponse(status="success", message="Bookmarks retrieved", data=res)


@router.post("", response_model=StandardResponse[BookmarkResponse])
async def create_bookmark(
    data: BookmarkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a bookmark."""
    bm = BookmarkService.create_bookmark(db, current_user.id, data.item_type, data.item_id, data.title, data.meta_json)
    res = BookmarkResponse.model_validate(bm)
    return StandardResponse(status="success", message="Bookmark created", data=res)


@router.delete("/{bookmark_id}", response_model=StandardResponse[dict])
async def delete_bookmark(
    bookmark_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a bookmark."""
    success = BookmarkService.delete_bookmark(db, bookmark_id, current_user.id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bookmark not found")
    return StandardResponse(status="success", message="Bookmark deleted", data={"deleted": True})
