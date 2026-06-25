"""Classification service — automation potential determination."""

from app.models.enums import AutomationPotential, Category

# Categories with high automation potential
HIGH_AUTOMATION_CATEGORIES = {
    Category.REPETITIVE_WORK,
    Category.DATA_DUPLICATION,
    Category.MANUAL_APPROVALS,
    Category.LACK_OF_INTEGRATION,
}


def determine_automation_potential(category: str) -> AutomationPotential:
    """
    Determine automation potential based on category.

    High if: repetitive work, data duplication, manual approvals, lack of integration.
    Medium for: excessive search, human errors.
    Low for: waiting/dependency, unnecessary meetings, lack of traceability.
    """
    try:
        cat = Category(category)
    except ValueError:
        return AutomationPotential.MEDIUM

    if cat in HIGH_AUTOMATION_CATEGORIES:
        return AutomationPotential.HIGH

    if cat in {Category.EXCESSIVE_SEARCH, Category.HUMAN_ERRORS}:
        return AutomationPotential.MEDIUM

    return AutomationPotential.LOW
