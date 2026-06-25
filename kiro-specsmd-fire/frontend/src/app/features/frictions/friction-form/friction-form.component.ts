import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';

import { FrictionService } from '../../../core/services/friction.service';
import { FrictionCreate, CATEGORIES } from '../../../shared/models/friction.model';

@Component({
  selector: 'app-friction-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    InputNumberModule,
    RatingModule,
    ButtonModule,
  ],
  template: `
    <h1>{{ isEdit ? 'Editar' : 'Nueva' }} Fricción</h1>

    <div class="card" style="max-width: 700px;">
      <div class="field mb-3">
        <label for="title">Título *</label>
        <input pInputText id="title" [(ngModel)]="form.title" class="w-full" required />
      </div>

      <div class="field mb-3">
        <label for="description">Descripción</label>
        <textarea pInputTextarea id="description" [(ngModel)]="form.description" class="w-full" rows="3"></textarea>
      </div>

      <div class="field mb-3">
        <label for="area">Área</label>
        <input pInputText id="area" [(ngModel)]="form.area" class="w-full" placeholder="Ej: Ventas, Operaciones..." />
      </div>

      <div class="field mb-3">
        <label for="category">Categoría *</label>
        <p-dropdown
          id="category"
          [options]="categories"
          [(ngModel)]="form.category"
          optionLabel="label"
          optionValue="value"
          placeholder="Seleccionar categoría"
          styleClass="w-full"
        ></p-dropdown>
      </div>

      <div class="grid">
        <div class="col-4 field mb-3">
          <label for="frequency">Frecuencia (veces/mes) *</label>
          <p-inputNumber id="frequency" [(ngModel)]="form.frequency" [min]="1" styleClass="w-full"></p-inputNumber>
        </div>

        <div class="col-4 field mb-3">
          <label for="time">Minutos perdidos por vez *</label>
          <p-inputNumber id="time" [(ngModel)]="form.time_lost_minutes" [min]="1" styleClass="w-full"></p-inputNumber>
        </div>

        <div class="col-4 field mb-3">
          <label for="people">Personas afectadas *</label>
          <p-inputNumber id="people" [(ngModel)]="form.people_affected" [min]="1" styleClass="w-full"></p-inputNumber>
        </div>
      </div>

      <div class="field mb-4">
        <label for="pain">Nivel de molestia (1-5) *</label>
        <p-rating id="pain" [(ngModel)]="form.pain_level" [stars]="5" [cancel]="false"></p-rating>
      </div>

      <div class="flex gap-2">
        <button pButton label="Guardar" icon="pi pi-check" (click)="save()" [disabled]="!isValid()"></button>
        <button pButton label="Cancelar" icon="pi pi-times" class="p-button-secondary" (click)="cancel()"></button>
      </div>
    </div>
  `,
})
export class FrictionFormComponent implements OnInit {
  isEdit = false;
  frictionId: number | null = null;
  categories = CATEGORIES;

  form: FrictionCreate = {
    title: '',
    description: '',
    area: '',
    category: '',
    frequency: 4,
    time_lost_minutes: 30,
    people_affected: 1,
    pain_level: 3,
  };

  constructor(
    private frictionService: FrictionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.frictionId = +id;
      this.frictionService.getById(this.frictionId).subscribe((f) => {
        this.form = {
          title: f.title,
          description: f.description ?? '',
          area: f.area ?? '',
          category: f.category,
          frequency: f.frequency,
          time_lost_minutes: f.time_lost_minutes,
          people_affected: f.people_affected,
          pain_level: f.pain_level,
        };
      });
    }
  }

  isValid(): boolean {
    return !!(this.form.title && this.form.category && this.form.frequency > 0 && this.form.time_lost_minutes > 0);
  }

  save() {
    if (!this.isValid()) return;

    if (this.isEdit && this.frictionId) {
      this.frictionService.update(this.frictionId, this.form).subscribe(() => {
        this.router.navigate(['/frictions', this.frictionId]);
      });
    } else {
      this.frictionService.create(this.form).subscribe((created) => {
        this.router.navigate(['/frictions', created.id]);
      });
    }
  }

  cancel() {
    this.router.navigate(['/frictions']);
  }
}
