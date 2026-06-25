"""Tests for classification service."""

from app.models.enums import AutomationPotential
from app.services.classification import determine_automation_potential


def test_repetitive_work_returns_high():
    result = determine_automation_potential("repetitive_work")
    assert result == AutomationPotential.HIGH


def test_data_duplication_returns_high():
    result = determine_automation_potential("data_duplication")
    assert result == AutomationPotential.HIGH


def test_manual_approvals_returns_high():
    result = determine_automation_potential("manual_approvals")
    assert result == AutomationPotential.HIGH


def test_lack_of_integration_returns_high():
    result = determine_automation_potential("lack_of_integration")
    assert result == AutomationPotential.HIGH


def test_excessive_search_returns_medium():
    result = determine_automation_potential("excessive_search")
    assert result == AutomationPotential.MEDIUM


def test_human_errors_returns_medium():
    result = determine_automation_potential("human_errors")
    assert result == AutomationPotential.MEDIUM


def test_waiting_dependency_returns_low():
    result = determine_automation_potential("waiting_dependency")
    assert result == AutomationPotential.LOW


def test_unnecessary_meetings_returns_low():
    result = determine_automation_potential("unnecessary_meetings")
    assert result == AutomationPotential.LOW


def test_unknown_category_returns_medium():
    result = determine_automation_potential("unknown_thing")
    assert result == AutomationPotential.MEDIUM
