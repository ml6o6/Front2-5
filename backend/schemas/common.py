# backend/schemas/common.py
from typing import Generic, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class MessageResponse(BaseModel):
    """Унифицированный ответ для операций, не возвращающих сущность."""
    message: str


class HealthResponse(BaseModel):
    status: str = "ok"


class PaginationParams(BaseModel):
    """Параметры пагинации для GET-запросов списков."""
    page: int = Field(1, ge=1, description="Номер страницы, начиная с 1")
    page_size: int = Field(20, ge=1, le=100, description="Размер страницы")

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        return self.page_size


class PaginatedResponse(BaseModel, Generic[T]):
    """Универсальная обёртка для пагинированных ответов."""
    items: list[T]
    total: int
    page: int
    page_size: int

    @property
    def pages(self) -> int:
        if self.page_size <= 0:
            return 0
        return (self.total + self.page_size - 1) // self.page_size


class ErrorResponse(BaseModel):
    detail: str
