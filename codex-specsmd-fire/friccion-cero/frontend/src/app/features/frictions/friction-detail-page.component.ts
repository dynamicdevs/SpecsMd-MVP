import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { FrictionApiService } from '../../core/api/friction-api.service';
import { InitiativeApiService } from '../../core/api/initiative-api.service';
import type { FrictionDetail } from '../../core/models/friction.model';
import type { CreateInitiativeRequest } from '../../core/models/initiative.model';
import { InitiativeFormComponent } from '../initiatives/initiative-form.component';
import {
  automationPotentialLabel,
  categoryLabel,
  formatCurrency,
  formatHours,
  frequencyLabel,
  painLevelLabel,
  priorityLabel,
  prioritySeverity,
  statusLabel,
  statusSeverity
} from './friction-formatters';

@Component({
  selector: 'app-friction-detail-page',
  imports: [ButtonModule, CardModule, DialogModule, InitiativeFormComponent, ProgressSpinnerModule, RouterLink, TagModule],
  template: `
    <div class="page-stack">
      <header class="page-header">
        <div>
          <h2>Detalle de friccion</h2>
          <p>{{ frictionId }}</p>
        </div>
        <div class="header-actions">
          <a pButton routerLink="/frictions" severity="secondary">
            <i class="pi pi-arrow-left" aria-hidden="true"></i>
            <span>Volver</span>
          </a>
          <a pButton [routerLink]="['/frictions', frictionId, 'edit']" severity="secondary">
            <i class="pi pi-pencil" aria-hidden="true"></i>
            <span>Editar</span>
          </a>
          @if (friction(); as item) {
            <button pButton type="button" severity="contrast" (click)="openInitiativeDialog()">
              <i class="pi pi-bolt" aria-hidden="true"></i>
              <span>Crear iniciativa</span>
            </button>
          }
          @if (friction(); as item) {
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
            <p-progressSpinner ariaLabel="Cargando friccion" />
          </div>
        </p-card>
      } @else if (friction(); as item) {
        <section class="detail-grid">
          <p-card>
            <div class="card-stack">
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
              <div class="tag-row">
                <p-tag [severity]="prioritySeverity(item.priority)" [value]="priorityLabel(item.priority)" />
                <p-tag [severity]="statusSeverity(item.status)" [value]="statusLabel(item.status)" />
              </div>
            </div>
          </p-card>

          <p-card header="Impacto mensual">
            <dl class="metric-list">
              <div>
                <dt>Horas perdidas</dt>
                <dd>{{ formatHours(item.monthlyHoursLost) }}</dd>
              </div>
              <div>
                <dt>Costo estimado</dt>
                <dd>{{ formatCurrency(item.estimatedMonthlyCost) }}</dd>
              </div>
              <div>
                <dt>Minutos por evento</dt>
                <dd>{{ item.timeLostMinutes }}</dd>
              </div>
              <div>
                <dt>Personas afectadas</dt>
                <dd>{{ item.peopleAffected }}</dd>
              </div>
            </dl>
          </p-card>

          <p-card header="Clasificacion">
            <dl class="detail-list">
              <div>
                <dt>Area</dt>
                <dd>{{ item.area }}</dd>
              </div>
              <div>
                <dt>Categoria</dt>
                <dd>{{ categoryLabel(item.category) }}</dd>
              </div>
              <div>
                <dt>Frecuencia</dt>
                <dd>{{ frequencyLabel(item.frequency) }}</dd>
              </div>
              <div>
                <dt>Molestia</dt>
                <dd>{{ painLevelLabel(item.painLevel) }}</dd>
              </div>
              <div>
                <dt>Automatizacion</dt>
                <dd>{{ automationPotentialLabel(item.automationPotential) }}</dd>
              </div>
            </dl>
          </p-card>

          <p-card header="Seguimiento">
            <dl class="detail-list">
              <div>
                <dt>Comentarios</dt>
                <dd>{{ item.comments?.length ?? 0 }}</dd>
              </div>
              <div>
                <dt>Iniciativas</dt>
                <dd>{{ item.initiatives?.length ?? 0 }}</dd>
              </div>
            </dl>
            <div class="card-actions">
              <button pButton type="button" severity="secondary" (click)="openInitiativeDialog()">
                <i class="pi pi-plus" aria-hidden="true"></i>
                <span>Nueva iniciativa</span>
              </button>
            </div>
          </p-card>
        </section>
      } @else {
        <p-card>
          <div class="state-box">
            <strong>No se encontro la friccion</strong>
            <a pButton routerLink="/frictions" severity="secondary">Volver al listado</a>
          </div>
        </p-card>
      }

      <p-dialog
        header="Nueva iniciativa"
        [modal]="true"
        [(visible)]="initiativeDialogVisible"
        [style]="{ width: 'min(720px, 94vw)' }"
      >
        <app-initiative-form
          [saving]="savingInitiative()"
          (cancel)="initiativeDialogVisible = false"
          (saveInitiative)="createInitiative($event)"
        />
      </p-dialog>
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
      .tag-row,
      .card-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .card-actions {
        justify-content: flex-end;
        margin-top: 1rem;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.5fr) minmax(280px, 1fr);
        gap: 1rem;
      }

      .card-stack {
        display: grid;
        gap: 1rem;
      }

      h3 {
        margin: 0 0 0.5rem;
      }

      .metric-list,
      .detail-list {
        display: grid;
        gap: 0.85rem;
        margin: 0;
      }

      .metric-list div,
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

      .state-box {
        display: grid;
        min-height: 12rem;
        place-items: center;
      }

      @media (max-width: 920px) {
        .detail-grid {
          grid-template-columns: 1fr;
        }

        .page-header {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `
  ]
})
export class FrictionDetailPageComponent implements OnInit {
  private readonly confirmation = inject(ConfirmationService);
  private readonly frictionApi = inject(FrictionApiService);
  private readonly initiativeApi = inject(InitiativeApiService);
  private readonly messages = inject(MessageService);
  private readonly router = inject(Router);

  protected initiativeDialogVisible = false;
  protected readonly frictionId = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';
  protected readonly friction = signal<FrictionDetail | null>(null);
  protected readonly loading = signal(false);
  protected readonly savingInitiative = signal(false);

  protected readonly automationPotentialLabel = automationPotentialLabel;
  protected readonly categoryLabel = categoryLabel;
  protected readonly formatCurrency = formatCurrency;
  protected readonly formatHours = formatHours;
  protected readonly frequencyLabel = frequencyLabel;
  protected readonly painLevelLabel = painLevelLabel;
  protected readonly priorityLabel = priorityLabel;
  protected readonly prioritySeverity = prioritySeverity;
  protected readonly statusLabel = statusLabel;
  protected readonly statusSeverity = statusSeverity;

  public ngOnInit(): void {
    void this.loadFriction();
  }

  protected confirmDelete(friction: FrictionDetail, event: Event): void {
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

  protected openInitiativeDialog(): void {
    this.initiativeDialogVisible = true;
  }

  protected async createInitiative(payload: CreateInitiativeRequest): Promise<void> {
    this.savingInitiative.set(true);

    try {
      const initiative = await firstValueFrom(this.initiativeApi.createFromFriction(this.frictionId, payload));
      this.messages.add({
        severity: 'success',
        summary: 'Iniciativa creada',
        detail: initiative.title
      });
      this.initiativeDialogVisible = false;
      await this.loadFriction();
    } finally {
      this.savingInitiative.set(false);
    }
  }

  private async loadFriction(): Promise<void> {
    this.loading.set(true);

    try {
      this.friction.set(await firstValueFrom(this.frictionApi.get(this.frictionId)));
    } catch {
      this.friction.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  private async deleteFriction(friction: FrictionDetail): Promise<void> {
    await firstValueFrom(this.frictionApi.delete(friction.id));
    this.messages.add({
      severity: 'success',
      summary: 'Friccion eliminada',
      detail: friction.title
    });
    await this.router.navigate(['/frictions']);
  }
}
