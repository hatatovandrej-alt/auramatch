"""Compatibility engine — synergy across eight relationship channels.

For every channel we take two specific points from each partner's matrix,
sum them, reduce to a single arcana (1..22) and interpret. Each arcana has
a tonal classification (harmonious / working / transformative) which drives
both the channel meaning and the overall synergy percentage.
"""
from __future__ import annotations

from dataclasses import dataclass
from app.core.arcana import arcana_meaning, arcana_name
from app.core.matrix_calc import _compute_values, reduce_arcana
from app.schemas.compatibility import (
    CompatibilityChannel,
    CompatibilityResult,
    ChannelTone,
)
from app.schemas.matrix import BirthData


HARMONIOUS: frozenset[int] = frozenset({1, 3, 6, 11, 14, 17, 19, 21, 22})
TRANSFORMATIVE: frozenset[int] = frozenset({12, 13, 15, 16, 18})
# Anything else lands in "working" — solid but asks for awareness.


def _tone(value: int) -> ChannelTone:
    if value in HARMONIOUS:
        return "harmonious"
    if value in TRANSFORMATIVE:
        return "transformative"
    return "working"


# Channel weights — anchors of relationship usually count more than passing
# layers. Tuned so the most relationship-defining points dominate the score.
_TONE_WEIGHT: dict[ChannelTone, float] = {
    "harmonious": 1.0,
    "working": 0.72,
    "transformative": 0.45,
}


@dataclass(frozen=True)
class _ChannelSpec:
    key: str
    label: str
    description: str
    point_a: str
    point_b: str
    weight: float


_CHANNELS: tuple[_ChannelSpec, ...] = (
    _ChannelSpec(
        "soul",
        "Душевная связь",
        "Личностное созвучие — как ощущается партнёр на уровне базы.",
        "A", "A",
        weight=1.2,
    ),
    _ChannelSpec(
        "emotions",
        "Эмоциональный резонанс",
        "Центры матриц встречаются — глубина чувств и взаимного раскрытия.",
        "E", "E",
        weight=1.3,
    ),
    _ChannelSpec(
        "purpose",
        "Совместная миссия",
        "Где предназначения пересекаются и усиливают друг друга.",
        "D", "D",
        weight=1.1,
    ),
    _ChannelSpec(
        "family",
        "Родовые сценарии",
        "Стыковка ваших семейных программ и родительских моделей.",
        "B", "B",
        weight=0.9,
    ),
    _ChannelSpec(
        "realisation",
        "Социальная реализация",
        "Поддержка друг друга в проявлении и достижениях в мире.",
        "C", "C",
        weight=0.9,
    ),
    _ChannelSpec(
        "attraction",
        "Притяжение полей",
        "Магия влечения: личность одного встречает мир другого.",
        "A", "C",
        weight=1.0,
    ),
    _ChannelSpec(
        "karma",
        "Кармический обмен",
        "Уроки, которые приходят через эту встречу — что отрабатывается.",
        "DA", "DA",
        weight=1.0,
    ),
    _ChannelSpec(
        "flow",
        "Энергетический поток",
        "Совместный финансовый и творческий канал пары.",
        "HC", "HD",
        weight=0.9,
    ),
)


_HEADLINES: tuple[tuple[int, str, str], ...] = (
    (85, "Редкое созвучие", "Ваши матрицы поют в унисон — отношения как ресурс."),
    (70, "Тёплая связь", "Много общего на ключевых уровнях, лёгкая совместная динамика."),
    (55, "Глубокая работа", "Союз с потенциалом — потребуется осознанность и труд."),
    (40, "Учительская встреча", "Партнёрство для роста: много энергии, требующей внимания."),
    (0, "Точка трансформации", "Соприкосновение даст обоим важный опыт перемен."),
)


def _headline(percent: int) -> tuple[str, str]:
    for threshold, title, body in _HEADLINES:
        if percent >= threshold:
            return title, body
    return _HEADLINES[-1][1], _HEADLINES[-1][2]


def calc_compatibility(req_a: BirthData, req_b: BirthData) -> CompatibilityResult:
    values_a = _compute_values(req_a.date)
    values_b = _compute_values(req_b.date)

    channels: list[CompatibilityChannel] = []
    weighted_score = 0.0
    weighted_max = 0.0

    for spec in _CHANNELS:
        va = values_a[spec.point_a]
        vb = values_b[spec.point_b]
        merged = reduce_arcana(va + vb)
        tone = _tone(merged)
        weighted_score += _TONE_WEIGHT[tone] * spec.weight
        weighted_max += spec.weight
        channels.append(
            CompatibilityChannel(
                key=spec.key,
                label=spec.label,
                description=spec.description,
                value=merged,
                arcana=arcana_name(merged),
                meaning=arcana_meaning(merged),
                tone=tone,
                person_a_value=va,
                person_b_value=vb,
            )
        )

    synergy = round((weighted_score / weighted_max) * 100)
    # Clamp into [0,100] defensively in case weight tuning drifts.
    synergy = max(0, min(100, synergy))
    title, body = _headline(synergy)
    summary = (
        f"{req_a.name} и {req_b.name}: {synergy}% синергии. {body} "
        "Нажмите на каждый канал, чтобы узнать его смысл."
    )

    return CompatibilityResult(
        person_a_name=req_a.name,
        person_b_name=req_b.name,
        person_a_birth=req_a.date,
        person_b_birth=req_b.date,
        synergy_percent=synergy,
        tone_label=title,
        headline=body,
        summary=summary,
        channels=channels,
    )


__all__: tuple[str, ...] = ("calc_compatibility",)
