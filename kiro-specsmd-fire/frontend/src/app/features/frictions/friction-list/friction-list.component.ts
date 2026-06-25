import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { FrictionService } from '../../../core/services/friction.service';
import { Friction, CATEGORIES } from '../../../shared/models/friction.model';

@Component({
  selector: 'app-friction-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TableModule, ButtonModule, TagModule],
  template: `
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="m-0">Fricciones</h1>
      <a routerLink="/frictions/new">
        <button pButton label="Nueva Fricción" icon="pi pi-plus" class="p-button-success"></button>
      </a>
    </div>

    <p-table
      [value]="frictions"
      [paginator]="true"
      [rows]="10"
      [sortMode]="'single'"
      [globalFilterFields]="['title', 'category', 'priority']"
      styleClass="p-datatable-striped"
    >
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="title">Título <p-sortIcon field="title" /></th>
          <th pSortableColumn="category">Categoría <p-sortIcon field="category" /></th>
          <th pSortableColumn="monthly_hours_lost">Horas/Mes <p-sortIcon field="monthly_hours_lost" /></th>
          <th pSortableColumn="estimated_monthly_cost">Costo/Mes <p-sortIcon field="estimated_monthly_cost" /></th>
          <th pSortableColumn="priority">Prioridad <p-sortIcon field="priority" /></th>
          <th>Acciones</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-friction>
        <tr>
          <td>{{ friction.title }}</td>
          <td>{{ getCategoryLabel(friction.category) }}</td>
          <td>{{ friction.monthly_hours_lost | number:'1.1-1' }}h</td>
          <td>\${{ friction.estimated_monthly_cost | number:'1.0-0' }}</td>
          <td>
            <p-tag
              [value]="friction.priority"
              [severity]="getPrioritySeverity(friction.priority)"
            />
          </td>
          <td>
            <a [routerLink]="['/frictions', friction.id]">
              <button pButton icon="pi pi-eye" class="p-button-text p-button-sm"></button>
            </a>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="6" class="text-center p-4">
            No hay fricciones registradas. <a routerLink="/frictions/new">Crear la primera</a>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class FrictionListComponent implements OnInit {
  frictions: Friction[] = [];

  constructor(private frictionService: FrictionService) {}

  ngOnInit() {
    this.frictionService.getAll().subscribe((data) => {
      this.frictions = data;
    });
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
}
