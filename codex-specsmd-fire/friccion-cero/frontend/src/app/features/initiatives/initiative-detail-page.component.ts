import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { InitiativeApiService } from '../../core/api/initiative-api.service';
import type { Initiative, UpdateInitiativeRequest } from '../../core/models/initiative.model';
import { InitiativeFormComponent } from './initiative-form.component';
import {
  complexityLabel,
  formatPercent,
  initiativePriorityLabel,
  initiativePrioritySeverity,
  initiativeStatusLabel,
  initiativeStatusSeverity
} from './initiative-formatters';

@Component({
  selector: 'app-initiative-detail-page',
  imports: [ButtonModule, CardModule, InitiativeFormComponent, ProgressSpinnerModule, RouterLink, TagModule],
  template: `
    <div class="page-stack">
      <header class="page-header">
        <div>
          <h2>Detalle de iniciativa</h2>
          <p>{{ initiativeId }}</p>
        </div>
        <div class="header-actions">
          <a pButton routerLink="/initiatives" severity="secondary">
            <i class="pi pi-arrow-left" aria-hidden="true"></i>
            <span>Volver</span>
          </a>
          @if (initiative(); as item) {
            <button pButton type="button" severity="secondary" (click)="editing.set(!editing())">
              <i class="pi pi-pencil" aria-hidden="true"></i>
              <span>{{ editing() ? 'Cerrar edicion' : 'Editar' }}</span>
            </button>
            <button pButton type="button" severity="danger" (click)="confirmDelete(item, $event)">
              <i class="pi pi-trash" aria-hidden="true"></i>
              <span>Eliminar</span>
            </button>
          }
        </div>
      </header>

      @if (loading()) {
        <p-card>
          <div class="state-box">
            <p-progressSpinner ariaLabel="Cargando iniciativa" />
          </div>
        </p-card>
      } @else if (initiative(); as item) {
        <section class="detail-grid">
          <p-card>
            <div class="card-stack">
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.proposedSolution }}</p>
              </div>
              <div class="tag-row">
                <p-tag [severity]="initiativePrioritySeverity(item.priority)" [value]="initiativePriorityLabel(item.priority)" />
                <p-tag [severity]="initiativeStatusSeverity(item.status)" [value]="initiativeStatusLabel(item.status)" />
              </div>
            </div>
          </p-card>

          <p-card header="Seguimiento">
            <dl class="detail-list">
              <div>
                <dt>Reduccion esperada</dt>
                <dd>{{ formatPercent(item.expectedReductionPercent) }}</dd>
              </div>
              <div>
                <dt>Complejidad</dt>
                <dd>{{ complexityLabel(item.complexity) }}</dd>
              </div>
              <div>
                <dt>Prioridad</dt>
                <dd>{{ initiativePriorityLabel(item.priority) }}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{{ initiativeStatusLabel(item.status) }}</dd>
              </div>
            </dl>
          </p-card>

          <p-card header="Friccion relacionada">
            @if (item.friction) {
              <a class="row-title" [routerLink]="['/frictions', item.friction.id]">{{ item.friction.title }}</a>
              <p>{{ item.friction.area }}</p>
            } @else {
              <p>Sin contexto de friccion.</p>
            }
          </p-card>

          @if (editing()) {
            <p-card header="Editar seguimiento">
              <app-initiative-form
                [initialValue]="item"
                [saving]="saving()"
                (cancel)="editing.set(false)"
                (saveInitiative)="save($event)"
              />
            </p-card>
          }
        </section>
      } @else {
        <p-card>
          <div class="state-box">
            <strong>No se encontro la iniciativa</strong>
            <a pButton routerLink="/initiatives" severity="secondary">Volver al listado</a>
          </div>
        </p-card>
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

      h2,
      p {
        margin: 0;
      }

      p {
        color: #667085;
      }

      .header-actions,
      .tag-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .detail-grid,
      .card-stack {
        display: grid;
        gap: 1rem;
      }

      h3 {
        margin: 0 0 0.5rem;
      }

      .detail-list {
        display: grid;
        gap: 0.85rem;
        margin: 0;
      }

      .detail-list div {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
      }

      dt {
        color: #667085;
      }

      dd {
        margin: 0;
        font-weight: 700;
        text-align: right;
      }

      .row-title {
        color: #0f5ea8;
        font-weight: 700;
        text-decoration: none;
      }

      .state-box {
        display: grid;
        min-height: 12rem;
        place-items: center;
      }

      @media (max-width: 920px) {
        .page-header {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `
  ]
})
export class InitiativeDetailPageComponent implements OnInit {
  private readonly confirmation = inject(ConfirmationService);
  private readonly initiativeApi = inject(InitiativeApiService);
  private readonly messages = inject(MessageService);
  private readonly router = inject(Router);

  protected readonly initiativeId = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';
  protected readonly editing = signal(false);
  protected readonly initiative = signal<Initiative | null>(null);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);

  protected readonly complexityLabel = complexityLabel;
  protected readonly formatPercent = formatPercent;
  protected readonly initiativePriorityLabel = initiativePriorityLabel;
  protected readonly initiativePrioritySeverity = initiativePrioritySeverity;
  protected readonly initiativeStatusLabel = initiativeStatusLabel;
  protected readonly initiativeStatusSeverity = initiativeStatusSeverity;

  public ngOnInit(): void {
    void this.loadInitiative();
  }

  protected async save(payload: UpdateInitiativeRequest): Promise<void> {
    this.saving.set(true);

    try {
      const updated = await firstValueFrom(this.initiativeApi.update(this.initiativeId, payload));
      this.initiative.set(updated);
      this.editing.set(false);
      this.messages.add({
        severity: 'success',
        summary: 'Iniciativa actualizada',
        detail: updated.title
      });
    } finally {
      this.saving.set(false);
    }
  }

  protected confirmDelete(initiative: Initiative, event: Event): void {
    this.confirmation.confirm({
      accept: () => void this.deleteInitiative(initiative),
      header: 'Eliminar iniciativa',
      message: `Eliminar "${initiative.title}" no se puede deshacer.`,
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

  private async loadInitiative(): Promise<void> {
    this.loading.set(true);

    try {
      this.initiative.set(await firstValueFrom(this.initiativeApi.get(this.initiativeId)));
    } catch {
      this.initiative.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  private async deleteInitiative(initiative: Initiative): Promise<void> {
    await firstValueFrom(this.initiativeApi.delete(initiative.id));
    this.messages.add({
      severity: 'success',
      summary: 'Iniciativa eliminada',
      detail: initiative.title
    });
    await this.router.navigate(['/initiatives']);
  }
}
