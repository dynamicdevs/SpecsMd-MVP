import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { FrictionApiService } from '../../core/api/friction-api.service';
import type { Friction } from '../../core/models/friction.model';
import {
  categoryLabel,
  formatCurrency,
  formatHours,
  priorityLabel,
  prioritySeverity,
  statusLabel,
  statusSeverity
} from './friction-formatters';

@Component({
  selector: 'app-frictions-page',
  imports: [
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    RouterLink,
    TableModule,
    TagModule,
    ToastModule
  ],
  template: `
    <div class="page-stack">
      <header class="page-header">
        <div>
          <h2>Fricciones</h2>
          <p>Registro operativo</p>
        </div>
        <a pButton routerLink="/frictions/new">
          <i class="pi pi-plus" aria-hidden="true"></i>
          <span>Nueva friccion</span>
        </a>
      </header>

      <p-card>
        @if (loading()) {
          <div class="state-box">
            <p-progressSpinner ariaLabel="Cargando fricciones" />
          </div>
        } @else if (error()) {
          <div class="state-box error-state">
            <strong>No se pudieron cargar las fricciones</strong>
            <button pButton type="button" severity="secondary" (click)="loadFrictions()">
              <i class="pi pi-refresh" aria-hidden="true"></i>
              <span>Reintentar</span>
            </button>
          </div>
        } @else if (frictions().length === 0) {
          <div class="state-box">
            <span>Sin fricciones registradas</span>
            <a pButton routerLink="/frictions/new">
              <i class="pi pi-plus" aria-hidden="true"></i>
              <span>Crear primera friccion</span>
            </a>
          </div>
        } @else {
          <p-table [value]="frictions()" dataKey="id" responsiveLayout="scroll">
            <ng-template pTemplate="header">
              <tr>
                <th>Titulo</th>
                <th>Area</th>
                <th>Categoria</th>
                <th>Horas</th>
                <th>Costo</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th class="action-column">Acciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-friction>
              <tr>
                <td>
                  <a class="row-title" [routerLink]="['/frictions', friction.id]">{{ friction.title }}</a>
                  <small>{{ friction.description }}</small>
                </td>
                <td>{{ friction.area }}</td>
                <td>{{ categoryLabel(friction.category) }}</td>
                <td>{{ formatHours(friction.monthlyHoursLost) }}</td>
                <td>{{ formatCurrency(friction.estimatedMonthlyCost) }}</td>
                <td>
                  <p-tag [severity]="prioritySeverity(friction.priority)" [value]="priorityLabel(friction.priority)" />
                </td>
                <td>
                  <p-tag [severity]="statusSeverity(friction.status)" [value]="statusLabel(friction.status)" />
                </td>
                <td>
                  <div class="row-actions">
                    <a pButton [routerLink]="['/frictions', friction.id]" severity="secondary" aria-label="Ver detalle">
                      <i class="pi pi-eye" aria-hidden="true"></i>
                    </a>
                    <a pButton [routerLink]="['/frictions', friction.id, 'edit']" severity="secondary" aria-label="Editar">
                      <i class="pi pi-pencil" aria-hidden="true"></i>
                    </a>
                    <button pButton type="button" severity="danger" aria-label="Eliminar" (click)="confirmDelete(friction, $event)">
                      <i class="pi pi-trash" aria-hidden="true"></i>
                    </button>
                  </div>
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

      p {
        color: #667085;
      }

      .state-box {
        display: grid;
        gap: 1rem;
        min-height: 14rem;
        place-items: center;
        color: #667085;
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
        max-width: 22rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .action-column {
        width: 10rem;
      }

      .row-actions {
        display: flex;
        gap: 0.35rem;
      }
    `
  ]
})
export class FrictionsPageComponent implements OnInit {
  private readonly confirmation = inject(ConfirmationService);
  private readonly frictionApi = inject(FrictionApiService);
  private readonly messages = inject(MessageService);

  protected readonly frictions = signal<Friction[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal(false);

  protected readonly categoryLabel = categoryLabel;
  protected readonly formatCurrency = formatCurrency;
  protected readonly formatHours = formatHours;
  protected readonly priorityLabel = priorityLabel;
  protected readonly prioritySeverity = prioritySeverity;
  protected readonly statusLabel = statusLabel;
  protected readonly statusSeverity = statusSeverity;

  public ngOnInit(): void {
    void this.loadFrictions();
  }

  public async loadFrictions(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      this.frictions.set(await firstValueFrom(this.frictionApi.list()));
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  protected confirmDelete(friction: Friction, event: Event): void {
    this.confirmation.confirm({
      accept: () => void this.deleteFriction(friction),
      header: 'Eliminar friccion',
      message: `Eliminar "${friction.title}" no se puede deshacer.`,
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary'
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger'
      },
      target: event.currentTarget as EventTarget
    });
  }

  private async deleteFriction(friction: Friction): Promise<void> {
    await firstValueFrom(this.frictionApi.delete(friction.id));
    this.messages.add({
      severity: 'success',
      summary: 'Friccion eliminada',
      detail: friction.title
    });
    await this.loadFrictions();
  }
}
