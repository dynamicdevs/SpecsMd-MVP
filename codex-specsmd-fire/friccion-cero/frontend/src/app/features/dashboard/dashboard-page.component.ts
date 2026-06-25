import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DashboardApiService } from '../../core/api/dashboard-api.service';
import type { DashboardSummary } from '../../core/models/dashboard.model';
import type { InitiativeStatus } from '../../core/models/initiative.model';
import {
  categoryLabel,
  formatCurrency,
  formatHours,
  priorityLabel,
  prioritySeverity,
  statusLabel,
  statusSeverity,
} from '../frictions/friction-formatters';
import { initiativeStatusOptions } from '../initiatives/initiative-options';
import {
  initiativeStatusLabel,
  initiativeStatusSeverity,
} from '../initiatives/initiative-formatters';

type StatusSummaryItem = {
  label: string;
  value: InitiativeStatus;
  count: number;
};

@Component({
  selector: 'app-dashboard-page',
  imports: [ButtonModule, CardModule, ProgressSpinnerModule, RouterLink, TableModule, TagModule],
  template: `
    <div class="page-stack">
      <header class="page-header">
        <div>
          <p-tag severity="info" value="Dashboard" />
          <h2>Metricas generales</h2>
        </div>

        <button
          pButton
          type="button"
          icon="pi pi-refresh"
          label="Actualizar"
          severity="secondary"
          (click)="loadSummary()"
        ></button>
      </header>

      @if (loading()) {
        <section class="state-panel" aria-label="Cargando dashboard">
          <p-progress-spinner strokeWidth="4" ariaLabel="Cargando" />
          <span>Cargando metricas...</span>
        </section>
      } @else if (error()) {
        <section class="state-panel state-panel-error">
          <strong>No se pudo cargar el dashboard.</strong>
          <span>{{ error() }}</span>
          <button
            pButton
            type="button"
            icon="pi pi-refresh"
            label="Reintentar"
            (click)="loadSummary()"
          ></button>
        </section>
      } @else if (summary(); as dashboard) {
        <div class="metric-grid">
          <p-card header="Fricciones">
            <strong>{{ dashboard.totals.frictions }}</strong>
            <span>Total registradas</span>
          </p-card>
          <p-card header="Horas mensuales">
            <strong>{{ formatHours(dashboard.totals.monthlyHoursLost) }}</strong>
            <span>Tiempo perdido estimado</span>
          </p-card>
          <p-card header="Costo mensual">
            <strong>{{ formatCurrency(dashboard.totals.estimatedMonthlyCost) }}</strong>
            <span>Costo operacional estimado</span>
          </p-card>
          <p-card header="Iniciativas">
            <strong>{{ dashboard.totals.initiatives }}</strong>
            <span>Mejoras en seguimiento</span>
          </p-card>
        </div>

        @if (isEmptyDashboard(dashboard)) {
          <section class="state-panel">
            <strong>No hay fricciones registradas todavia.</strong>
            <span>Cuando el equipo registre fricciones, sus metricas apareceran aca.</span>
            <a pButton routerLink="/frictions/new" icon="pi pi-plus" label="Registrar friccion"></a>
          </section>
        } @else {
          <section class="dashboard-grid">
            <p-card header="Estado de iniciativas">
              <div class="status-list">
                @for (item of initiativeStatusItems(dashboard); track item.value) {
                  <div class="status-row">
                    <p-tag [severity]="initiativeStatusSeverity(item.value)" [value]="item.label" />
                    <strong>{{ item.count }}</strong>
                  </div>
                }
              </div>
            </p-card>

            <p-card header="Ranking de fricciones mas costosas">
              @if (dashboard.mostCostlyFrictions.length > 0) {
                <p-table [value]="dashboard.mostCostlyFrictions" responsiveLayout="scroll">
                  <ng-template pTemplate="header">
                    <tr>
                      <th>Friccion</th>
                      <th>Area</th>
                      <th>Categoria</th>
                      <th>Horas</th>
                      <th>Costo</th>
                      <th>Prioridad</th>
                      <th>Estado</th>
                      <th class="actions-column">Accion</th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-friction>
                    <tr>
                      <td>
                        <strong class="table-title">{{ friction.title }}</strong>
                      </td>
                      <td>{{ friction.area }}</td>
                      <td>{{ categoryLabel(friction.category) }}</td>
                      <td>{{ formatHours(friction.monthlyHoursLost) }}</td>
                      <td>{{ formatCurrency(friction.estimatedMonthlyCost) }}</td>
                      <td>
                        <p-tag
                          [severity]="prioritySeverity(friction.priority)"
                          [value]="priorityLabel(friction.priority)"
                        />
                      </td>
                      <td>
                        <p-tag
                          [severity]="statusSeverity(friction.status)"
                          [value]="statusLabel(friction.status)"
                        />
                      </td>
                      <td class="actions-column">
                        <a
                          pButton
                          [routerLink]="['/frictions', friction.id]"
                          icon="pi pi-eye"
                          severity="secondary"
                          text
                          rounded
                          aria-label="Ver detalle"
                        ></a>
                      </td>
                    </tr>
                  </ng-template>
                </p-table>
              } @else {
                <div class="empty-inline">
                  <strong>Sin ranking disponible.</strong>
                  <span>Registra fricciones con costo estimado para ver el ranking.</span>
                </div>
              }
            </p-card>
          </section>
        }
      }
    </div>
  `,
  styles: [
    `
      .page-stack {
        display: grid;
        gap: 1rem;
      }

      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      h2 {
        margin: 0.5rem 0 0;
        font-size: 1.35rem;
      }

      .metric-grid,
      .dashboard-grid {
        display: grid;
        gap: 1rem;
      }

      .metric-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .dashboard-grid {
        grid-template-columns: minmax(18rem, 0.8fr) minmax(0, 1.6fr);
        align-items: start;
      }

      strong {
        display: block;
      }

      .metric-grid strong {
        font-size: 1.75rem;
      }

      .metric-grid span,
      .state-panel span,
      .empty-inline span {
        color: var(--p-text-muted-color);
      }

      .status-list {
        display: grid;
        gap: 0.75rem;
      }

      .status-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        border-bottom: 1px solid var(--p-content-border-color);
        padding-bottom: 0.75rem;
      }

      .status-row:last-child {
        border-bottom: 0;
        padding-bottom: 0;
      }

      .status-row strong {
        font-size: 1.25rem;
      }

      .state-panel,
      .empty-inline {
        display: grid;
        justify-items: start;
        gap: 0.75rem;
        border: 1px solid var(--p-content-border-color);
        border-radius: 8px;
        background: var(--p-content-background);
        padding: 1rem;
      }

      .state-panel {
        justify-items: center;
        text-align: center;
      }

      .state-panel-error {
        border-color: var(--p-red-300);
      }

      .table-title {
        min-width: 12rem;
      }

      .actions-column {
        text-align: right;
        width: 5rem;
      }

      @media (max-width: 1100px) {
        .dashboard-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 920px) {
        .metric-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 640px) {
        .page-header {
          align-items: stretch;
          flex-direction: column;
        }

        .metric-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DashboardPageComponent implements OnInit {
  private readonly dashboardApi = inject(DashboardApiService);

  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly summary = signal<DashboardSummary | null>(null);

  public ngOnInit(): void {
    void this.loadSummary();
  }

  protected async loadSummary(): Promise<void> {
    this.error.set(null);
    this.loading.set(true);

    try {
      this.summary.set(await firstValueFrom(this.dashboardApi.getSummary()));
    } catch {
      this.error.set('Revisa que el backend este ejecutandose y vuelve a intentarlo.');
    } finally {
      this.loading.set(false);
    }
  }

  protected initiativeStatusItems(summary: DashboardSummary): StatusSummaryItem[] {
    return initiativeStatusOptions.map((option) => ({
      count: summary.initiativeCountsByStatus[option.value] ?? 0,
      label: initiativeStatusLabel(option.value),
      value: option.value,
    }));
  }

  protected isEmptyDashboard(summary: DashboardSummary): boolean {
    return summary.totals.frictions === 0 && summary.mostCostlyFrictions.length === 0;
  }

  protected readonly categoryLabel = categoryLabel;
  protected readonly formatCurrency = formatCurrency;
  protected readonly formatHours = formatHours;
  protected readonly initiativeStatusSeverity = initiativeStatusSeverity;
  protected readonly priorityLabel = priorityLabel;
  protected readonly prioritySeverity = prioritySeverity;
  protected readonly statusLabel = statusLabel;
  protected readonly statusSeverity = statusSeverity;
}
