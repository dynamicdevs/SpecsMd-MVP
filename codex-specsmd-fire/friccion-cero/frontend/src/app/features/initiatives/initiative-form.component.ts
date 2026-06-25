import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import type { Priority } from '../../core/models/friction.model';
import type {
  CreateInitiativeRequest,
  Initiative,
  InitiativeComplexity,
  InitiativeStatus
} from '../../core/models/initiative.model';
import {
  initiativeComplexityOptions,
  initiativePriorityOptions,
  initiativeStatusOptions
} from './initiative-options';

@Component({
  selector: 'app-initiative-form',
  imports: [ButtonModule, InputNumberModule, InputTextModule, ReactiveFormsModule, SelectModule, TextareaModule],
  template: `
    <form class="initiative-form" [formGroup]="form" (ngSubmit)="submit()">
      <label class="field">
        <span>Titulo</span>
        <input pInputText formControlName="title" autocomplete="off" />
        @if (controlInvalid('title')) {
          <small>El titulo es requerido.</small>
        }
      </label>

      <label class="field wide">
        <span>Solucion propuesta</span>
        <textarea pTextarea formControlName="proposedSolution" rows="4"></textarea>
        @if (controlInvalid('proposedSolution')) {
          <small>La solucion propuesta es requerida.</small>
        }
      </label>

      <label class="field">
        <span>Reduccion esperada</span>
        <p-inputNumber formControlName="expectedReductionPercent" [min]="0" [max]="100" suffix="%" [showButtons]="true" />
        @if (controlInvalid('expectedReductionPercent')) {
          <small>Debe estar entre 0 y 100.</small>
        }
      </label>

      <label class="field">
        <span>Complejidad</span>
        <p-select [options]="complexityOptions" optionLabel="label" optionValue="value" formControlName="complexity" />
      </label>

      <label class="field">
        <span>Prioridad</span>
        <p-select [options]="priorityOptions" optionLabel="label" optionValue="value" formControlName="priority" />
      </label>

      <label class="field">
        <span>Estado</span>
        <p-select [options]="statusOptions" optionLabel="label" optionValue="value" formControlName="status" />
      </label>

      <div class="form-actions wide">
        <button pButton type="button" severity="secondary" (click)="cancel.emit()">
          <i class="pi pi-times" aria-hidden="true"></i>
          <span>Cancelar</span>
        </button>
        <button pButton type="submit" [disabled]="saving">
          <i class="pi pi-save" aria-hidden="true"></i>
          <span>{{ saving ? 'Guardando' : 'Guardar' }}</span>
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .initiative-form {
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
        gap: 0.5rem;
      }

      input,
      textarea,
      p-select,
      p-inputnumber {
        width: 100%;
      }

      @media (max-width: 760px) {
        .initiative-form {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class InitiativeFormComponent implements OnChanges {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  @Input() public initialValue: Initiative | null = null;
  @Input() public saving = false;
  @Output() public readonly cancel = new EventEmitter<void>();
  @Output() public readonly saveInitiative = new EventEmitter<CreateInitiativeRequest>();

  protected readonly complexityOptions = initiativeComplexityOptions;
  protected readonly priorityOptions = initiativePriorityOptions;
  protected readonly statusOptions = initiativeStatusOptions;

  public readonly form = this.formBuilder.group({
    title: ['', [Validators.required]],
    proposedSolution: ['', [Validators.required]],
    expectedReductionPercent: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    complexity: ['medium' as InitiativeComplexity, [Validators.required]],
    priority: ['medium' as Priority, [Validators.required]],
    status: ['proposed' as InitiativeStatus, [Validators.required]]
  });

  public ngOnChanges(): void {
    if (!this.initialValue) {
      this.form.reset({
        complexity: 'medium',
        expectedReductionPercent: 50,
        priority: 'medium',
        proposedSolution: '',
        status: 'proposed',
        title: ''
      });
      return;
    }

    this.form.patchValue({
      complexity: this.initialValue.complexity,
      expectedReductionPercent: this.initialValue.expectedReductionPercent,
      priority: this.initialValue.priority,
      proposedSolution: this.initialValue.proposedSolution,
      status: this.initialValue.status,
      title: this.initialValue.title
    });
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saveInitiative.emit(this.form.getRawValue());
  }

  public controlInvalid(name: string): boolean {
    const control = this.form.get(name);
    return Boolean(control?.invalid && (control.dirty || control.touched));
  }
}
