from typing import Generic, TypeVar, Optional, Any, List
from datetime import datetime
from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationMeta(BaseModel):
    total: int
    page: int
    size: int
    pages: int


class StandardResponse(BaseModel, Generic[T]):
    status: str = Field(default="success", description="Status string: success or error")
    message: str = Field(default="Operation completed successfully", description="User-facing descriptive message")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat(), description="ISO timestamp")
    data: Optional[T] = Field(default=None, description="Response payload")
    pagination: Optional[PaginationMeta] = Field(default=None, description="Pagination metadata if applicable")
    errors: Optional[List[Any]] = Field(default=None, description="List of errors if status is error")
    metadata: Optional[dict] = Field(default=None, description="Additional context metadata")
