import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import type { CreateFrictionRequest } from '../models/friction.model';
import type { CreateInitiativeRequest } from '../models/initiative.model';
import { DashboardApiService } from './dashboard-api.service';
import { FrictionApiService } from './friction-api.service';
import { InitiativeApiService } from './initiative-api.service';

describe('API services', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('requests the dashboard summary endpoint', () => {
    const service = TestBed.inject(DashboardApiService);

    service.getSummary().subscribe((summary) => {
      expect(summary.totals.frictions).toBe(0);
    });

    const request = http.expectOne('http://localhost:3000/api/dashboard');
    expect(request.request.method).toBe('GET');
    request.flush({
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
    });
  });

  it('posts new frictions to the friction endpoint', () => {
    const service = TestBed.inject(FrictionApiService);
    const payload: CreateFrictionRequest = {
      area: 'Operations',
      description: 'The team copies data manually between systems.',
      frequency: 'weekly',
      painLevel: 'medium',
      peopleAffected: 3,
      timeLostMinutes: 20,
      title: 'Manual copy',
    };

    service.create(payload).subscribe((friction) => {
      expect(friction.id).toBe('friction-1');
    });

    const request = http.expectOne('http://localhost:3000/api/frictions');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({
      ...payload,
      automationPotential: 'high',
      category: 'manual_repetitive_work',
      createdAt: '2026-06-25T00:00:00.000Z',
      estimatedMonthlyCost: 100,
      id: 'friction-1',
      monthlyHoursLost: 4,
      priority: 'medium',
      status: 'open',
      updatedAt: '2026-06-25T00:00:00.000Z',
    });
  });

  it('posts initiatives through the source friction endpoint', () => {
    const service = TestBed.inject(InitiativeApiService);
    const payload: CreateInitiativeRequest = {
      complexity: 'medium',
      expectedReductionPercent: 70,
      proposedSolution: 'Automate approval routing.',
      title: 'Approval workflow',
    };

    service.createFromFriction('friction-1', payload).subscribe((initiative) => {
      expect(initiative.frictionId).toBe('friction-1');
    });

    const request = http.expectOne('http://localhost:3000/api/frictions/friction-1/initiatives');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({
      ...payload,
      createdAt: '2026-06-25T00:00:00.000Z',
      frictionId: 'friction-1',
      id: 'initiative-1',
      priority: 'high',
      status: 'proposed',
      updatedAt: '2026-06-25T00:00:00.000Z',
    });
  });
});
