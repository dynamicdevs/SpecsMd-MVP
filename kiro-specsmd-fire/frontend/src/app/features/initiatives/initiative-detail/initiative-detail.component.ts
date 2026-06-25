import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';

import { InitiativeService } from '../../../core/services/initiative.service';
import { Initiative } from '../../../shared/models/friction.model';

@Component({
  selector: 'app-initiative-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonModule, TagModule, DropdownModule],
  template: `
    <div *ngIf="initiative">
      <div class="flex justify-content-between align-items-center mb-4">
        <h1 class="m-0">{{ initiative.title }}</h1>
        <button pButton label="Eliminar" icon="pi pi-trash" class="p-button-danger p-button-outlined" (click)="deleteInitiative()"></button>
      </div>

      <div class="grid">
        <div class="col-8">
          <div class="card mb-3">
            <h3>Solución Propuesta</h3>
            <p>{{ initiative.proposed_solution || 'Sin solución definida aún' }}</p>
          </div>

          <div class="card">
            <h3>Detalles</h3>
            <div class="grid">
              <div class="col-4"><strong>Complejidad:</strong><br/>{{ initiative.complexity }}</div>
              <div class="col-4"><strong>Reducción esperada:</strong><br/>{{ initiative.expected_reduction_percent }}%</div>
              <div class="col-4">
                <strong>Fricción origen:</strong><br/>
                <a [routerLink]="['/frictions', initiative.friction_id]">Ver fricción #{{ initiative.friction_id }}</a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-4">
          <div class="card">
            <h3>Estado</h3>
            <p-dropdown
              [options]="statusOptions"
              [(ngModel)]="initiative.status"
              (onChange)="updateStatus()"
              styleClass="w-full"
            ></p-dropdown>
            <div class="mt-3">
              <strong>Prioridad:</strong><br/>
              <p-tag [value]="initiative.priority" [severity]="getPrioritySeverity(initiative.priority)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class InitiativeDetailComponent implements OnInit {
  initiative: Initiative | null = null;
  statusOptions = [
    { label: 'Propuesta', value: 'proposed' },
    { label: 'En Progreso', value: 'in_progress' },
    { label: 'Completada', value: 'completed' },
    { label: 'Cancelada', value: 'cancelled' },
  ];

  constructor(
    private initiativeService: InitiativeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.initiativeService.getById(id).subscribe((i) => (this.initiative = i));
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'info';
    }
  }

  updateStatus() {
    if (!this.initiative) return;
    this.initiativeService
      .update(this.initiative.id, { status: this.initiative.status })
      .subscribe();
  }

  deleteInitiative() {
    if (!this.initiative) return;
    if (confirm('¿Eliminar esta iniciativa?')) {
      this.initiativeService.delete(this.initiative.id).subscribe(() => {
        this.router.navigate(['/initiatives']);
      });
    }
  }
}
