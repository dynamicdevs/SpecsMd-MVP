import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

import { InitiativeService } from '../../../core/services/initiative.service';
import { Initiative } from '../../../shared/models/friction.model';

@Component({
  selector: 'app-initiative-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TableModule, TagModule, ButtonModule],
  template: `
    <h1>Iniciativas</h1>

    <p-table [value]="initiatives" [paginator]="true" [rows]="10" styleClass="p-datatable-striped">
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="title">Título <p-sortIcon field="title" /></th>
          <th pSortableColumn="status">Estado <p-sortIcon field="status" /></th>
          <th pSortableColumn="complexity">Complejidad <p-sortIcon field="complexity" /></th>
          <th pSortableColumn="priority">Prioridad <p-sortIcon field="priority" /></th>
          <th>Reducción esperada</th>
          <th>Acciones</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-initiative>
        <tr>
          <td>{{ initiative.title }}</td>
          <td><p-tag [value]="initiative.status" [severity]="getStatusSeverity(initiative.status)" /></td>
          <td>{{ initiative.complexity }}</td>
          <td><p-tag [value]="initiative.priority" [severity]="getPrioritySeverity(initiative.priority)" /></td>
          <td>{{ initiative.expected_reduction_percent }}%</td>
          <td>
            <a [routerLink]="['/initiatives', initiative.id]">
              <button pButton icon="pi pi-eye" class="p-button-text p-button-sm"></button>
            </a>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="6" class="text-center p-4">No hay iniciativas creadas aún.</td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class InitiativeListComponent implements OnInit {
  initiatives: Initiative[] = [];

  constructor(private initiativeService: InitiativeService) {}

  ngOnInit() {
    this.initiativeService.getAll().subscribe((data) => (this.initiatives = data));
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'proposed': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
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
