"""Matrix calculation endpoints."""
from __future__ import annotations

from datetime import date

from fastapi import APIRouter, HTTPException, status

# Alias the core function so it cannot be shadowed by a route handler defined
# below — a recursion regression bit us once, this guard makes it impossible.
from app.core.matrix_calc import calculate_matrix as core_calc_matrix
from app.schemas.matrix import BirthData, MatrixResult

router = APIRouter(prefix="/api", tags=["matrix"])


@router.post(
    "/matrix",
    response_model=MatrixResult,
    status_code=status.HTTP_200_OK,
    summary="Calculate personal Destiny Matrix",
)
def post_matrix(payload: BirthData) -> MatrixResult:
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
    return core_calc_matrix(payload.name, payload.date)
