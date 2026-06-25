import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FrictionApiService } from '../../core/api/friction-api.service';
import type {
  AutomationPotential,
  CreateFrictionRequest,
  FrictionCategory,
  FrictionStatus,
  Frequency,
  PainLevel,
  UpdateFrictionRequest
} from '../../core/models/friction.model';
import {
  automationPotentialOptions,
  categoryOptions,
  frequencyOptions,
  painLevelOptions,
  statusOptions
} from './friction-options';

@Component({
  selector: 'app-friction-form-page',
  imports: [
    ButtonModule,
    CardModule,
    InputNumberModule,
    InputTextModule,
    ReactiveFormsModule,
    RouterLink,
    SelectModule,
    TextareaModule
  ],
  template: `
    <div class="page-stack">
      <header class="page-header">
        <div>
          <h2>{{ frictionId ? 'Editar friccion' : 'Nueva friccion' }}</h2>
          <p>Los campos calculados los entrega el backend despues de guardar.</p>
        </div>
        <a pButton routerLink="/frictions" severity="secondary">
          <i class="pi pi-arrow-left" aria-hidden="true"></i>
          <span>Volver</span>
        </a>
      </header>

      <p-card>
        <form class="friction-form" [formGroup]="form" (ngSubmit)="save()">
          <label class="field">
            <span>Titulo</span>
            <input pInputText formControlName="title" autocomplete="off" />
            @if (controlInvalid('title')) {
              <small>El titulo es requerido.</small>
            }
          </label>

          <label class="field wide">
            <span>Descripcion</span>
            <textarea pTextarea formControlName="description" rows="4"></textarea>
            @if (controlInvalid('description')) {
              <small>La descripcion es requerida.</small>
            }
          </label>

          <label class="field">
            <span>Area</span>
            <input pInputText formControlName="area" autocomplete="off" />
            @if (controlInvalid('area')) {
              <small>El area es requerida.</small>
            }
          </label>

          <label class="field">
            <span>Frecuencia</span>
            <p-select [options]="frequencyOptions" optionLabel="label" optionValue="value" formControlName="frequency" />
          </label>

          <label class="field">
            <span>Minutos perdidos por evento</span>
            <p-inputNumber formControlName="timeLostMinutes" [min]="0" [showButtons]="true" />
            @if (controlInvalid('timeLostMinutes')) {
              <small>Debe ser 0 o mayor.</small>
            }
          </label>

          <label class="field">
            <span>Personas afectadas</span>
            <p-inputNumber formControlName="peopleAffected" [min]="1" [showButtons]="true" />
            @if (controlInvalid('peopleAffected')) {
              <small>Debe ser 1 o mayor.</small>
            }
          </label>

          <label class="field">
            <span>Nivel de molestia</span>
            <p-select [options]="painLevelOptions" optionLabel="label" optionValue="value" formControlName="painLevel" />
          </label>

          <label class="field">
            <span>Estado</span>
            <p-select [options]="statusOptions" optionLabel="label" optionValue="value" formControlName="status" />
          </label>

          @if (frictionId) {
            <label class="field">
              <span>Categoria</span>
              <p-select [options]="categoryOptions" optionLabel="label" optionValue="value" formControlName="category" />
            </label>

            <label class="field">
              <span>Potencial de automatizacion</span>
              <p-select
                [options]="automationPotentialOptions"
                optionLabel="label"
                optionValue="value"
                formControlName="automationPotential"
              />
            </label>
          }

          <div class="form-actions wide">
            <button pButton type="submit" [disabled]="saving()">
              <i class="pi pi-save" aria-hidden="true"></i>
              <span>{{ saving() ? 'Guardando' : 'Guardar' }}</span>
            </button>
          </div>
        </form>
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

      .friction-form {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      .field {
        display: grid;
        gap: 0.4rem;
      }

      .field span {
        color: #344054;
        font-size: 0.9rem;
        font-weight: 700;
      }

      .field small {
        color: #b42318;
      }

      .wide {
        grid-column: 1 / -1;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
      }

      input,
      textarea,
      p-select,
      p-inputnumber {
        width: 100%;
      }

      @media (max-width: 760px) {
        .friction-form {
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
export class FrictionFormPageComponent implements OnInit {
  private readonly frictionApi = inject(FrictionApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly messages = inject(MessageService);
  private readonly router = inject(Router);

  protected readonly frictionId = inject(ActivatedRoute).snapshot.paramMap.get('id');
  protected readonly saving = signal(false);

  protected readonly automationPotentialOptions = automationPotentialOptions;
  protected readonly categoryOptions = categoryOptions;
  protected readonly frequencyOptions = frequencyOptions;
  protected readonly painLevelOptions = painLevelOptions;
  protected readonly statusOptions = statusOptions;

  public readonly form = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    area: ['', [Validators.required]],
    frequency: ['daily' as Frequency, [Validators.required]],
    timeLostMinutes: [0, [Validators.required, Validators.min(0)]],
    peopleAffected: [1, [Validators.required, Validators.min(1)]],
    painLevel: ['medium' as PainLevel, [Validators.required]],
    status: ['open' as FrictionStatus, [Validators.required]],
    category: ['unclassified' as FrictionCategory],
    automationPotential: ['medium' as AutomationPotential]
  });

  public ngOnInit(): void {
    if (this.frictionId) {
      void this.loadFriction(this.frictionId);
    }
  }

  public async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.form.getRawValue();

    try {
      const friction = this.frictionId
        ? await firstValueFrom(this.frictionApi.update(this.frictionId, this.toUpdatePayload(value)))
        : await firstValueFrom(this.frictionApi.create(this.toCreatePayload(value)));

      this.messages.add({
        severity: 'success',
        summary: 'Friccion guardada',
        detail: friction.title
      });
      await this.router.navigate(['/frictions', friction.id]);
    } finally {
      this.saving.set(false);
    }
  }

  protected controlInvalid(name: string): boolean {
    const control = this.form.get(name);
    return Boolean(control?.invalid && (control.dirty || control.touched));
  }

  private async loadFriction(id: string): Promise<void> {
    const friction = await firstValueFrom(this.frictionApi.get(id));

    this.form.patchValue({
      area: friction.area,
      automationPotential: friction.automationPotential,
      category: friction.category,
      description: friction.description,
      frequency: friction.frequency,
      painLevel: friction.painLevel,
      peopleAffected: friction.peopleAffected,
      status: friction.status,
      timeLostMinutes: friction.timeLostMinutes,
      title: friction.title
    });
  }

  private toCreatePayload(value: FrictionFormValue): CreateFrictionRequest {
    return {
      area: value.area,
      description: value.description,
      frequency: value.frequency,
      painLevel: value.painLevel,
      peopleAffected: value.peopleAffected,
      status: value.status,
      timeLostMinutes: value.timeLostMinutes,
      title: value.title
    };
  }

  private toUpdatePayload(value: FrictionFormValue): UpdateFrictionRequest {
    return {
      ...this.toCreatePayload(value),
      automationPotential: value.automationPotential,
      category: value.category
    };
  }
}

type FrictionFormValue = ReturnType<FrictionFormPageComponent['form']['getRawValue']>;
