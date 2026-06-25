import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DashboardApiService } from '../../core/api/dashboard-api.service';
import type { DashboardSummary } from '../../core/models/dashboard.model';
import { DashboardPageComponent } from './dashboard-page.component';

describe('DashboardPageComponent', () => {
  it('renders totals, initiative status summary, and costly friction ranking', async () => {
    await configureDashboard(summaryWithRanking());

    const fixture = TestBed.createComponent(DashboardPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('7');
    expect(compiled.textContent).toContain('125,5 h');
    expect(compiled.textContent).toContain('24.500');
    expect(compiled.textContent).toContain('Planificada');
    expect(compiled.textContent).toContain('Carga manual de reportes');
    expect(compiled.textContent).toContain('Finanzas');
    expect(compiled.textContent).toContain('Alta');
  });

  it('renders an empty state when there are no frictions', async () => {
    await configureDashboard(emptySummary());

    const fixture = TestBed.createComponent(DashboardPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No hay fricciones registradas todavia.');
    expect(compiled.textContent).toContain('Registrar friccion');
  });
});

async function configureDashboard(summary: DashboardSummary): Promise<void> {
  await TestBed.configureTestingModule({
    imports: [DashboardPageComponent],
    providers: [
      provideRouter([]),
      {
        provide: DashboardApiService,
        useValue: {
          getSummary: () => of(summary),
        },
      },
    ],
  }).compileComponents();
}

function summaryWithRanking(): DashboardSummary {
  return {
    frictionCountsByCategory: {
      manual_repetitive_work: 4,
    },
    frictionCountsByPriority: {
      high: 3,
      medium: 4,
    },
    frictionCountsByStatus: {
      open: 5,
      resolved: 2,
    },
    initiativeCountsByStatus: {
      planned: 2,
      proposed: 1,
    },
    mostCostlyFrictions: [
      {
        area: 'Finanzas',
        category: 'manual_repetitive_work',
        estimatedMonthlyCost: 24500,
        id: 'friction-1',
        monthlyHoursLost: 125.5,
        priority: 'high',
        status: 'open',
        title: 'Carga manual de reportes',
      },
    ],
    totals: {
      estimatedMonthlyCost: 24500,
      frictions: 7,
      initiatives: 3,
      monthlyHoursLost: 125.5,
    },
  };
}

function emptySummary(): DashboardSummary {
  return {
    frictionCountsByCategory: {},
    frictionCountsByPriority: {},
    frictionCountsByStatus: {},
    initiativeCountsByStatus: {},
    mostCostlyFrictions: [],
    totals: {
      estimatedMonthlyCost: 0,
      frictions: 0,
      initiatives: 0,
      monthlyHoursLost: 0,
    },
  };
}
