"""Pydantic models for the matrix endpoint.

Kept in a dedicated module so the calculation engine and the API layer share
exactly one shape definition. Validation is strict — birthdate has to land in
a sensible historical window so downstream code never has to defend itself.
"""
from __future__ import annotations

from datetime import date as date_cls, time as time_cls
from typing import Annotated

from pydantic import BaseModel, Field, StringConstraints


Name = Annotated[str, StringConstraints(min_length=1, max_length=80, strip_whitespace=True)]


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
    key: str
    label: str
    value: int


class MatrixResult(BaseModel):
    name: str
    points: list[MatrixPoint]
    summary: str
