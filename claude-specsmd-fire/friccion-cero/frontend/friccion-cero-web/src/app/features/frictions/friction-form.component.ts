import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { FrictionService } from '../../core/services/friction.service';
import {
  AUTOMATION_POTENTIALS,
  CATEGORIES,
  FRICTION_STATUSES,
  toOptions,
} from '../../core/models/enums';

@Component({
  selector: 'app-friction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
  ],
  templateUrl: './friction-form.component.html',
})
export class FrictionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(FrictionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messages = inject(MessageService);

  categories = toOptions(CATEGORIES);
  statuses = toOptions(FRICTION_STATUSES);
  automation = toOptions(AUTOMATION_POTENTIALS);

  id: number | null = null;
  saving = false;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    description: [''],
    area: [''],
    category: [null as string | null], // null => backend sugiere
    frequency: [1, [Validators.required, Validators.min(0)]],
    timeLostMinutes: [0, [Validators.required, Validators.min(0)]],
    peopleAffected: [1, [Validators.required, Validators.min(0)]],
    painLevel: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    automationPotential: ['Medio', Validators.required],
    status: ['Detectada', Validators.required],
  });

  get isEdit(): boolean {
    return this.id !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.service.get(this.id).subscribe({
        next: (f) =>
          this.form.patchValue({
            title: f.title,
            description: f.description,
            area: f.area,
            category: f.category,
            frequency: f.frequency,
            timeLostMinutes: f.timeLostMinutes,
            peopleAffected: f.peopleAffected,
            painLevel: f.painLevel,
            automationPotential: f.automationPotential,
            status: f.status,
          }),
        error: () =>
          this.messages.add({ severity: 'error', summary: 'Error', detail: 'Fricción no encontrada.' }),
      });
    }
  }

  suggestCategory(): void {
    const text = `${this.form.value.title ?? ''} ${this.form.value.description ?? ''}`.trim();
    if (!text) {
      return;
    }
    this.service.classify(text).subscribe({
      next: (res) => {
        this.form.patchValue({ category: res.category });
        this.messages.add({ severity: 'info', summary: 'Categoría sugerida', detail: res.category });
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const payload = this.form.getRawValue() as any;

    const obs = this.isEdit
      ? this.service.update(this.id!, payload)
      : this.service.create(payload);

    obs.subscribe({
      next: (f) => {
        this.messages.add({
          severity: 'success',
          summary: this.isEdit ? 'Actualizada' : 'Creada',
          detail: f.title,
        });
        this.router.navigate(['/frictions', f.id]);
      },
      error: () => {
        this.saving = false;
        this.messages.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar.' });
      },
    });
  }
}
