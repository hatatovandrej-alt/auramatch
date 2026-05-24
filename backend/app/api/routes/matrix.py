"""Matrix calculation endpoints."""
from __future__ import annotations

from datetime import date

from fastapi import APIRouter, HTTPException, status

from app.core.matrix_calc import build_result
from app.schemas.matrix import BirthData, MatrixResult

router = APIRouter(prefix="/api", tags=["matrix"])


@router.post(
    "/matrix",
    response_model=MatrixResult,
    status_code=status.HTTP_200_OK,
    summary="Calculate personal Destiny Matrix",
)
def calculate_matrix(payload: BirthData) -> MatrixResult:
    if payload.date > date.today():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Дата рождения не может быть в будущем",
        )
    if payload.date.year < 1900:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Поддерживаются даты начиная с 1900 года",
        )
    return build_result(payload.name, payload.date)
