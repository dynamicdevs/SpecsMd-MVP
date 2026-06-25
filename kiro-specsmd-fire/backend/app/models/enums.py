"""Enums for Fricción Cero domain."""

from enum import Enum


class Category(str, Enum):
    REPETITIVE_WORK = "repetitive_work"
    WAITING_DEPENDENCY = "waiting_dependency"
    DATA_DUPLICATION = "data_duplication"
    UNNECESSARY_MEETINGS = "unnecessary_meetings"
    MANUAL_APPROVALS = "manual_approvals"
    LACK_OF_INTEGRATION = "lack_of_integration"
    EXCESSIVE_SEARCH = "excessive_search"
    HUMAN_ERRORS = "human_errors"
    LACK_OF_TRACEABILITY = "lack_of_traceability"


class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class FrictionStatus(str, Enum):
    ACTIVE = "active"
    RESOLVED = "resolved"
    DISMISSED = "dismissed"


class InitiativeStatus(str, Enum):
    PROPOSED = "proposed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Complexity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class PainLevel(int, Enum):
    MINIMAL = 1
    LOW = 2
    MODERATE = 3
    HIGH = 4
    CRITICAL = 5


class AutomationPotential(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
