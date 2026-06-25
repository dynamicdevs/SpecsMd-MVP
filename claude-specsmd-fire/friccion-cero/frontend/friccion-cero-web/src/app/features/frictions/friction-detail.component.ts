import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { FrictionService } from '../../core/services/friction.service';
import { InitiativeService } from '../../core/services/initiative.service';
import { Friction } from '../../core/models/friction.model';
import { COMPLEXITIES, Priority, prioritySeverity, toOptions } from '../../core/models/enums';

@Component({
  selector: 'app-friction-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    TagModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
  ],
  templateUrl: './friction-detail.component.html',
})
export class FrictionDetailComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(FrictionService);
  private initiativeService = inject(InitiativeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messages = inject(MessageService);

  friction?: Friction;
  loading = true;
  dialogVisible = false;
  savingInitiative = false;
  complexities = toOptions(COMPLEXITIES);

  initiativeForm = this.fb.group({
    title: ['', Validators.required],
    proposedSolution: [''],
    expectedReductionPercent: [0, [Validators.min(0), Validators.max(100)]],
    complexity: ['Media', Validators.required],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.get(id).subscribe({
      next: (f) => {
        this.friction = f;
        this.loading = false;
        this.initiativeForm.patchValue({ title: `Mejorar: ${f.title}` });
      },
      error: () => {
        this.loading = false;
        this.messages.add({ severity: 'error', summary: 'Error', detail: 'Fricción no encontrada.' });
      },
    });
  }

  severity(p?: string) {
    return prioritySeverity((p ?? 'Baja') as Priority);
  }

  openInitiativeDialog(): void {
    this.dialogVisible = true;
  }

  createInitiative(): void {
    if (!this.friction || this.initiativeForm.invalid) {
      this.initiativeForm.markAllAsTouched();
      return;
    }
    this.savingInitiative = true;
    this.initiativeService
      .create({ frictionId: this.friction.id, ...(this.initiativeForm.getRawValue() as any) })
      .subscribe({
        next: (i) => {
          this.dialogVisible = false;
          this.savingInitiative = false;
          this.messages.add({ severity: 'success', summary: 'Iniciativa creada', detail: i.title });
          this.router.navigate(['/initiatives', i.id]);
        },
        error: () => {
          this.savingInitiative = false;
          this.messages.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la iniciativa.' });
        },
      });
  }
}
