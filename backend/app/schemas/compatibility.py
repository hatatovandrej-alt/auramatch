"""Compatibility request/response shapes."""
from __future__ import annotations

from datetime import date as date_cls
from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.matrix import BirthData

ChannelTone = Literal["harmonious", "working", "transformative"]


class CompatibilityRequest(BaseModel):
    person_a: BirthData
    person_b: BirthData

    model_config = {
        "json_schema_extra": {
            "example": {
                "person_a": {"name": "Алиса", "date": "1993-07-21", "time": "08:30"},
                "person_b": {"name": "Марк", "date": "1990-02-14", "time": None},
            }
        }
    }


class CompatibilityChannel(BaseModel):
    key: str
    label: str
    description: str
    value: int = Field(..., ge=1, le=22)
    arcana: str
    meaning: str
    tone: ChannelTone
    person_a_value: int = Field(..., ge=1, le=22)
    person_b_value: int = Field(..., ge=1, le=22)


class CompatibilityResult(BaseModel):
    person_a_name: str
    person_b_name: str
    person_a_birth: date_cls
    person_b_birth: date_cls
    synergy_percent: int = Field(..., ge=0, le=100)
    tone_label: str
    headline: str
    summary: str
    channels: list[CompatibilityChannel]
