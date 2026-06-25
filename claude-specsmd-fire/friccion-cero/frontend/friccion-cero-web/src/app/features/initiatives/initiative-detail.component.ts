import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { InitiativeService } from '../../core/services/initiative.service';
import { Initiative } from '../../core/models/initiative.model';
import {
  COMPLEXITIES,
  INITIATIVE_STATUSES,
  PRIORITIES,
  toOptions,
} from '../../core/models/enums';

@Component({
  selector: 'app-initiative-detail',
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
  templateUrl: './initiative-detail.component.html',
})
export class InitiativeDetailComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(InitiativeService);
  private route = inject(ActivatedRoute);
  private messages = inject(MessageService);

  initiative?: Initiative;
  loading = true;
  saving = false;

  complexities = toOptions(COMPLEXITIES);
  priorities = toOptions(PRIORITIES);
  statuses = toOptions(INITIATIVE_STATUSES);

  form = this.fb.group({
    title: ['', Validators.required],
    proposedSolution: [''],
    expectedReductionPercent: [0, [Validators.min(0), Validators.max(100)]],
    complexity: ['Media', Validators.required],
    priority: ['Media', Validators.required],
    status: ['Propuesta', Validators.required],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.get(id).subscribe({
      next: (i) => {
        this.initiative = i;
        this.loading = false;
        this.form.patchValue({
          title: i.title,
          proposedSolution: i.proposedSolution,
          expectedReductionPercent: i.expectedReductionPercent,
          complexity: i.complexity,
          priority: i.priority,
          status: i.status,
        });
      },
      error: () => {
        this.loading = false;
        this.messages.add({ severity: 'error', summary: 'Error', detail: 'Iniciativa no encontrada.' });
      },
    });
  }

  save(): void {
    if (!this.initiative || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.service.update(this.initiative.id, this.form.getRawValue() as any).subscribe({
      next: (i) => {
        this.initiative = i;
        this.saving = false;
        this.messages.add({ severity: 'success', summary: 'Guardada', detail: i.title });
      },
      error: () => {
        this.saving = false;
        this.messages.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar.' });
      },
    });
  }
}
