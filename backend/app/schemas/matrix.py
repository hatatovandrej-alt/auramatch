"""Pydantic models for the matrix endpoint.

Kept in a dedicated module so the calculation engine and the API layer share
exactly one shape definition. Validation is strict — birthdate has to land in
a sensible historical window so downstream code never has to defend itself.
"""
from __future__ import annotations

from datetime import date as date_cls, time as time_cls
from typing import Annotated, Literal

from pydantic import BaseModel, Field, StringConstraints


Name = Annotated[str, StringConstraints(min_length=1, max_length=80, strip_whitespace=True)]

PointGroup = Literal["corner", "diagonal", "center", "heart", "karma", "period"]


class BirthData(BaseModel):
    name: Name
    date: date_cls = Field(..., description="ISO date of birth (YYYY-MM-DD)")
    time: time_cls | None = Field(None, description="Local time of birth, optional")

    model_config = {"json_schema_extra": {"example": {
        "name": "Алиса",
        "date": "1993-07-21",
        "time": "08:30",
    }}}


class MatrixPoint(BaseModel):
    """One node on the matrix diagram.

    The frontend owns geometry — backend only ships values and meaning.
    `key` is stable across releases so the frontend can map id → position.
    """

    key: str
    group: PointGroup
    label: str
    value: int = Field(..., ge=1, le=22)
    arcana: str
    meaning: str
    age_range: str | None = None


class MatrixResult(BaseModel):
    name: str
    birth: date_cls
    points: list[MatrixPoint]
    summary: str
