"""Destiny Matrix calculation engine — Stage 1 stub.

The full canonical algorithm (corner points, lines, karmic tail, etc.) lands
in Stage 2. This module exposes a deterministic, well-shaped result so the
frontend can be developed against a real API surface without waiting on the
numerology pipeline.
"""
from __future__ import annotations

from datetime import date

from app.schemas.matrix import MatrixPoint, MatrixResult


def _reduce(n: int) -> int:
    """Reduce to the 1..22 arcana range used by Destiny Matrix numerology.

    Numbers 22 and below are returned as-is; anything larger is summed digit-by-
    digit until it fits. This matches the canonical reduction rule the full
    engine will use.
    """
    while n > 22:
        n = sum(int(d) for d in str(n))
    return n


def calc_basic_points(birth: date) -> list[MatrixPoint]:
    """Compute the four cornerstones of the matrix.

    Stage 1 implements only the corners; the inner points (heart, talents,
    karmic tail) will be layered in once the visualization is in place.
    """
    day = _reduce(birth.day)
    month = _reduce(birth.month)
    year = _reduce(sum(int(d) for d in str(birth.year)))
    purpose = _reduce(day + month + year)
    return [
        MatrixPoint(key="day", label="День (личность)", value=day),
        MatrixPoint(key="month", label="Месяц (род)", value=month),
        MatrixPoint(key="year", label="Год (общество)", value=year),
        MatrixPoint(key="purpose", label="Предназначение", value=purpose),
    ]


def build_result(name: str, birth: date) -> MatrixResult:
    points = calc_basic_points(birth)
    purpose = next(p.value for p in points if p.key == "purpose")
    summary = (
        f"{name}, ваше число предназначения — {purpose}. "
        "Это опорная точка матрицы; полная схема раскроется на следующих экранах."
    )
    return MatrixResult(name=name, points=points, summary=summary)
