"""Compatibility endpoint — two-matrix synergy."""
from __future__ import annotations

from datetime import date

from fastapi import APIRouter, HTTPException, status

from app.core.compatibility import calc_compatibility as core_calc_compat
from app.schemas.compatibility import CompatibilityRequest, CompatibilityResult

router = APIRouter(prefix="/api", tags=["compatibility"])


def _validate(birth: date, who: str) -> None:
    if birth > date.today():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Дата {who} не может быть в будущем",
        )
    if birth.year < 1900:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Дата {who} должна быть начиная с 1900 года",
        )


@router.post(
    "/compatibility",
    response_model=CompatibilityResult,
    status_code=status.HTTP_200_OK,
    summary="Compute relationship synergy between two matrices",
)
def post_compatibility(payload: CompatibilityRequest) -> CompatibilityResult:
    _validate(payload.person_a.date, "первого человека")
    _validate(payload.person_b.date, "второго человека")
    return core_calc_compat(payload.person_a, payload.person_b)
