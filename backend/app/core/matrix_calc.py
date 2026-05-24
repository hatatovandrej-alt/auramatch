"""Destiny Matrix calculation engine.

Layout (canonical Натальи Ладини / common Russian numerology variant):

                     B (north — month)
                    / \\
                   AB  BC
                  /     \\
       A (west) — E (center) — C (east)
                  \\     /
                   DA  CD
                    \\ /
                     D (south — purpose)

Outer cardinals A/B/C/D are the four cornerstones of the matrix.
The inner rotated square AB/BC/CD/DA encodes the karmic / generational layer.
Center E is the heart of the matrix (general talent / mission).
A four-point heart line (HA/HB/HC/HD) sits between E and each cardinal.
The karmic tail (KT1/KT2/KT3) extends below the SW (DA) corner.
Eight age periods sit at the edges, ten years each (0–80).
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from app.core.arcana import ARCANA, arcana_meaning, arcana_name
from app.schemas.matrix import MatrixPoint, MatrixResult


def _sum_digits(n: int) -> int:
    return sum(int(d) for d in str(abs(n)))


def reduce_arcana(n: int) -> int:
    """Reduce to the 1..22 arcana range.

    Anything above 22 is summed digit-by-digit until it fits. 0 is treated as
    22 (the Fool / closing of the cycle).
    """
    while n > 22:
        n = _sum_digits(n)
    return n if n != 0 else 22


@dataclass(frozen=True)
class _Spec:
    key: str
    group: str
    label: str
    age_range: str | None = None


# Order matters — frontend renders points in array order for stable z-index.
_SPECS: tuple[_Spec, ...] = (
    # Cardinal corners (outer diamond)
    _Spec("A", "corner", "День — личность"),
    _Spec("B", "corner", "Месяц — род"),
    _Spec("C", "corner", "Год — социум"),
    _Spec("D", "corner", "Предназначение"),
    # Center
    _Spec("E", "center", "Сердце матрицы"),
    # Inner diagonals (rotated square)
    _Spec("AB", "diagonal", "Линия отца"),
    _Spec("BC", "diagonal", "Линия матери"),
    _Spec("CD", "diagonal", "Социальная карма"),
    _Spec("DA", "diagonal", "Кармический хвост"),
    # Heart line (between center and cardinals)
    _Spec("HA", "heart", "Талант личности"),
    _Spec("HB", "heart", "Талант рода"),
    _Spec("HC", "heart", "Талант реализации"),
    _Spec("HD", "heart", "Дар миссии"),
    # Karmic tail expansion (3 extra points outside SW)
    _Spec("KT1", "karma", "Карма мужской линии"),
    _Spec("KT2", "karma", "Карма женской линии"),
    _Spec("KT3", "karma", "Личная кармическая задача"),
    # Eight life periods
    _Spec("P1", "period", "Детство", age_range="0–10"),
    _Spec("P2", "period", "Юность", age_range="10–20"),
    _Spec("P3", "period", "Становление", age_range="20–30"),
    _Spec("P4", "period", "Расцвет", age_range="30–40"),
    _Spec("P5", "period", "Зрелость", age_range="40–50"),
    _Spec("P6", "period", "Опыт", age_range="50–60"),
    _Spec("P7", "period", "Мудрость", age_range="60–70"),
    _Spec("P8", "period", "Итоги", age_range="70–80"),
)


def _compute_values(birth: date) -> dict[str, int]:
    A = reduce_arcana(birth.day)
    B = reduce_arcana(birth.month)
    C = reduce_arcana(_sum_digits(birth.year))
    D = reduce_arcana(A + B + C)
    E = reduce_arcana(A + B + C + D)

    AB = reduce_arcana(A + B)
    BC = reduce_arcana(B + C)
    CD = reduce_arcana(C + D)
    DA = reduce_arcana(D + A)

    HA = reduce_arcana(A + E)
    HB = reduce_arcana(B + E)
    HC = reduce_arcana(C + E)
    HD = reduce_arcana(D + E)

    # Karmic tail: stacks below the SW (DA) corner.
    # KT1 is the lived karma (already DA); KT2/KT3 are ancestral layers that
    # add to it; the personal task is the sum reduced.
    KT1 = DA
    KT2 = reduce_arcana(A + DA)
    KT3 = reduce_arcana(D + DA)

    # Age periods — each point sits at the midpoint between adjacent corners
    # and the inner diagonal, summing the two.
    P1 = reduce_arcana(A + AB)
    P2 = reduce_arcana(AB + B)
    P3 = reduce_arcana(B + BC)
    P4 = reduce_arcana(BC + C)
    P5 = reduce_arcana(C + CD)
    P6 = reduce_arcana(CD + D)
    P7 = reduce_arcana(D + DA)
    P8 = reduce_arcana(DA + A)

    return {
        "A": A, "B": B, "C": C, "D": D, "E": E,
        "AB": AB, "BC": BC, "CD": CD, "DA": DA,
        "HA": HA, "HB": HB, "HC": HC, "HD": HD,
        "KT1": KT1, "KT2": KT2, "KT3": KT3,
        "P1": P1, "P2": P2, "P3": P3, "P4": P4,
        "P5": P5, "P6": P6, "P7": P7, "P8": P8,
    }


def _summary(name: str, values: dict[str, int]) -> str:
    purpose = values["D"]
    center = values["E"]
    tail = values["DA"]
    p_arc, _ = ARCANA[purpose]
    c_arc, _ = ARCANA[center]
    t_arc, _ = ARCANA[tail]
    return (
        f"{name}, ваш центр — {center} ({c_arc}), миссия — {purpose} ({p_arc}), "
        f"кармический хвост — {tail} ({t_arc}). Нажмите на любую точку матрицы, "
        "чтобы раскрыть её смысл."
    )


def calculate_matrix(name: str, birth: date) -> MatrixResult:
    values = _compute_values(birth)
    points = [
        MatrixPoint(
            key=spec.key,
            group=spec.group,  # type: ignore[arg-type]
            label=spec.label,
            value=values[spec.key],
            arcana=arcana_name(values[spec.key]),
            meaning=arcana_meaning(values[spec.key]),
            age_range=spec.age_range,
        )
        for spec in _SPECS
    ]
    return MatrixResult(
        name=name,
        birth=birth,
        points=points,
        summary=_summary(name, values),
    )


# Backwards-compatible alias used by the route handler.
build_result = calculate_matrix
