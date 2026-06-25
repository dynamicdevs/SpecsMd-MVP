import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InitiativeApiService } from '../../core/api/initiative-api.service';
import type { Initiative } from '../../core/models/initiative.model';
import {
  complexityLabel,
  formatPercent,
  initiativePriorityLabel,
  initiativePrioritySeverity,
  initiativeStatusLabel,
  initiativeStatusSeverity
} from './initiative-formatters';

@Component({
  selector: 'app-initiatives-page',
  imports: [ButtonModule, CardModule, ProgressSpinnerModule, RouterLink, TableModule, TagModule],
  template: `
    <div class="page-stack">
      <header class="page-header">
        <div>
          <h2>Iniciativas</h2>
          <p>Seguimiento</p>
        </div>
      </header>

      <p-card>
        @if (loading()) {
          <div class="state-box">
            <p-progressSpinner ariaLabel="Cargando iniciativas" />
          </div>
        } @else if (error()) {
          <div class="state-box error-state">
            <strong>No se pudieron cargar las iniciativas</strong>
            <button pButton type="button" severity="secondary" (click)="loadInitiatives()">
              <i class="pi pi-refresh" aria-hidden="true"></i>
              <span>Reintentar</span>
            </button>
          </div>
        } @else if (initiatives().length === 0) {
          <div class="state-box">
            <span>Sin iniciativas registradas</span>
          </div>
        } @else {
          <p-table [value]="initiatives()" dataKey="id" responsiveLayout="scroll">
            <ng-template pTemplate="header">
              <tr>
                <th>Iniciativa</th>
                <th>Friccion</th>
                <th>Reduccion</th>
                <th>Complejidad</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th class="action-column">Acciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-initiative>
              <tr>
                <td>
                  <a class="row-title" [routerLink]="['/initiatives', initiative.id]">{{ initiative.title }}</a>
                  <small>{{ initiative.proposedSolution }}</small>
                </td>
                <td>
                  @if (initiative.friction) {
                    <a [routerLink]="['/frictions', initiative.friction.id]">{{ initiative.friction.title }}</a>
                  } @else {
                    <span>Sin contexto</span>
                  }
                </td>
                <td>{{ formatPercent(initiative.expectedReductionPercent) }}</td>
                <td>{{ complexityLabel(initiative.complexity) }}</td>
                <td>
                  <p-tag
                    [severity]="initiativePrioritySeverity(initiative.priority)"
                    [value]="initiativePriorityLabel(initiative.priority)"
                  />
                </td>
                <td>
                  <p-tag
                    [severity]="initiativeStatusSeverity(initiative.status)"
                    [value]="initiativeStatusLabel(initiative.status)"
                  />
                </td>
                <td>
                  <a pButton [routerLink]="['/initiatives', initiative.id]" severity="secondary" aria-label="Ver detalle">
                    <i class="pi pi-eye" aria-hidden="true"></i>
                  </a>
                </td>
              </tr>
            </ng-template>
          </p-table>
        }
      </p-card>
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

      h2,
      p {
        margin: 0;
      }

      p,
      .state-box {
        color: #667085;
      }

      .state-box {
        display: grid;
        gap: 1rem;
        min-height: 14rem;
        place-items: center;
      }

      .error-state {
        color: #b42318;
      }

      .row-title {
        display: block;
        color: #0f5ea8;
        font-weight: 700;
        text-decoration: none;
      }

      small {
        color: #667085;
        display: block;
        max-width: 24rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .action-column {
        width: 6rem;
      }
    `
  ]
})
export class InitiativesPageComponent implements OnInit {
  private readonly initiativeApi = inject(InitiativeApiService);

  protected readonly initiatives = signal<Initiative[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal(false);

  protected readonly complexityLabel = complexityLabel;
  protected readonly formatPercent = formatPercent;
  protected readonly initiativePriorityLabel = initiativePriorityLabel;
  protected readonly initiativePrioritySeverity = initiativePrioritySeverity;
  protected readonly initiativeStatusLabel = initiativeStatusLabel;
  protected readonly initiativeStatusSeverity = initiativeStatusSeverity;

  public ngOnInit(): void {
    void this.loadInitiatives();
  }

  public async loadInitiatives(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      this.initiatives.set(await firstValueFrom(this.initiativeApi.list()));
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
