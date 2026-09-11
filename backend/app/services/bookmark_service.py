from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.report import Bookmark


class BookmarkService:
    @staticmethod
    def get_user_bookmarks(db: Session, user_id: str, item_type: Optional[str] = None) -> List[Bookmark]:
        """Fetch user bookmarks."""
        query = db.query(Bookmark).filter_by(user_id=user_id)
        if item_type:
            query = query.filter_by(item_type=item_type)
        return query.order_by(Bookmark.created_at.desc()).all()

    @staticmethod
    def create_bookmark(db: Session, user_id: str, item_type: str, item_id: str, title: str, meta_json: Optional[str] = None) -> Bookmark:
        """Create a bookmark."""
        bm = db.query(Bookmark).filter_by(user_id=user_id, item_type=item_type, item_id=item_id).first()
        if not bm:
            bm = Bookmark(user_id=user_id, item_type=item_type, item_id=item_id, title=title, meta_json=meta_json)
            db.add(bm)
            db.commit()
            db.refresh(bm)
        return bm

    @staticmethod
    def delete_bookmark(db: Session, bookmark_id: str, user_id: str) -> bool:
        """Delete a bookmark."""
        bm = db.query(Bookmark).filter_by(id=bookmark_id, user_id=user_id).first()
        if bm:
            db.delete(bm)
            db.commit()
            return True
        return False
