import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { FrictionService } from '../../../core/services/friction.service';
import { Friction, FrictionComment, CATEGORIES } from '../../../shared/models/friction.model';

@Component({
  selector: 'app-friction-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonModule, TagModule, InputTextareaModule],
  template: `
    <div *ngIf="friction">
      <div class="flex justify-content-between align-items-center mb-4">
        <h1 class="m-0">{{ friction.title }}</h1>
        <div class="flex gap-2">
          <a [routerLink]="['/frictions', friction.id, 'edit']">
            <button pButton label="Editar" icon="pi pi-pencil" class="p-button-outlined"></button>
          </a>
          <button pButton label="Eliminar" icon="pi pi-trash" class="p-button-danger p-button-outlined" (click)="deleteFriction()"></button>
        </div>
      </div>

      <div class="grid">
        <div class="col-8">
          <div class="card mb-3">
            <h3>Descripción</h3>
            <p>{{ friction.description || 'Sin descripción' }}</p>

            <div class="grid mt-3">
              <div class="col-4"><strong>Área:</strong> {{ friction.area || 'N/A' }}</div>
              <div class="col-4"><strong>Categoría:</strong> {{ getCategoryLabel(friction.category) }}</div>
              <div class="col-4"><strong>Estado:</strong> {{ friction.status }}</div>
            </div>
          </div>

          <div class="card mb-3">
            <h3>Datos de Impacto</h3>
            <div class="grid">
              <div class="col-3"><strong>Frecuencia:</strong><br/>{{ friction.frequency }}x/mes</div>
              <div class="col-3"><strong>Tiempo perdido:</strong><br/>{{ friction.time_lost_minutes }} min/vez</div>
              <div class="col-3"><strong>Personas:</strong><br/>{{ friction.people_affected }}</div>
              <div class="col-3"><strong>Molestia:</strong><br/>{{ friction.pain_level }}/5</div>
            </div>
          </div>

          <!-- Comments -->
          <div class="card">
            <h3>Comentarios</h3>
            <div *ngFor="let c of comments" class="mb-2 p-2 border-1 border-round surface-border">
              <p class="m-0">{{ c.comment }}</p>
              <small class="text-500">{{ c.created_at | date:'short' }}</small>
            </div>
            <div class="mt-3 flex gap-2">
              <textarea pInputTextarea [(ngModel)]="newComment" placeholder="Agregar comentario..." rows="2" class="flex-1"></textarea>
              <button pButton icon="pi pi-send" (click)="addComment()" [disabled]="!newComment.trim()"></button>
            </div>
          </div>
        </div>

        <div class="col-4">
          <div class="card mb-3">
            <h3>Métricas Calculadas</h3>
            <div class="mb-2">
              <strong>Horas mensuales perdidas:</strong><br/>
              <span class="text-2xl font-bold text-orange-500">{{ friction.monthly_hours_lost | number:'1.1-1' }}h</span>
            </div>
            <div class="mb-2">
              <strong>Costo mensual estimado:</strong><br/>
              <span class="text-2xl font-bold text-red-500">\${{ friction.estimated_monthly_cost | number:'1.0-0' }}</span>
            </div>
            <div class="mb-2">
              <strong>Prioridad:</strong><br/>
              <p-tag [value]="friction.priority" [severity]="getPrioritySeverity(friction.priority)" />
            </div>
            <div>
              <strong>Potencial automatización:</strong><br/>
              <p-tag [value]="friction.automation_potential" [severity]="getAutomationSeverity(friction.automation_potential)" />
            </div>
          </div>

          <div class="card">
            <h3>Acciones</h3>
            <a routerLink="/frictions/new" [queryParams]="{fromFriction: friction.id}">
              <button pButton label="Crear Iniciativa" icon="pi pi-bolt" class="p-button-outlined w-full"></button>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FrictionDetailComponent implements OnInit {
  friction: Friction | null = null;
  comments: FrictionComment[] = [];
  newComment = '';

  constructor(
    private frictionService: FrictionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.frictionService.getById(id).subscribe((f) => (this.friction = f));
    this.frictionService.getComments(id).subscribe((c) => (this.comments = c));
  }

  getCategoryLabel(value: string): string {
    return CATEGORIES.find((c) => c.value === value)?.label ?? value;
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'info';
    }
  }

  getAutomationSeverity(level: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch (level) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'danger';
      default: return 'info';
    }
  }

  addComment() {
    if (!this.friction || !this.newComment.trim()) return;
    this.frictionService
      .addComment(this.friction.id, this.newComment.trim())
      .subscribe((c) => {
        this.comments.unshift(c);
        this.newComment = '';
      });
  }

  deleteFriction() {
    if (!this.friction) return;
    if (confirm('¿Eliminar esta fricción?')) {
      this.frictionService.delete(this.friction.id).subscribe(() => {
        this.router.navigate(['/frictions']);
      });
    }
  }
}
