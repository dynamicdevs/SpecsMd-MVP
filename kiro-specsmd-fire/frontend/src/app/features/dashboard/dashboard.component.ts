import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';

import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardData, CATEGORIES } from '../../shared/models/friction.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, TableModule, TagModule, ChartModule],
  template: `
    <h1>Dashboard</h1>

    <div *ngIf="data" class="grid">
      <!-- Metric Cards -->
      <div class="col-4">
        <p-card header="Total Fricciones">
          <span class="text-3xl font-bold">{{ data.total_frictions }}</span>
        </p-card>
      </div>
      <div class="col-4">
        <p-card header="Horas Mensuales Perdidas">
          <span class="text-3xl font-bold text-orange-500">{{ data.total_monthly_hours_lost | number:'1.1-1' }}h</span>
        </p-card>
      </div>
      <div class="col-4">
        <p-card header="Costo Mensual Estimado">
          <span class="text-3xl font-bold text-red-500">\${{ data.total_estimated_monthly_cost | number:'1.0-0' }}</span>
        </p-card>
      </div>

      <!-- Charts -->
      <div class="col-6">
        <p-card header="Distribución por Categoría">
          <p-chart type="bar" [data]="categoryChartData" [options]="chartOptions" />
        </p-card>
      </div>
      <div class="col-6">
        <p-card header="Distribución por Prioridad">
          <p-chart type="doughnut" [data]="priorityChartData" />
        </p-card>
      </div>

      <!-- Top Costly Frictions -->
      <div class="col-12">
        <p-card header="Top 5 Fricciones Más Costosas">
          <p-table [value]="data.top_costly_frictions" styleClass="p-datatable-sm">
            <ng-template pTemplate="header">
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Horas/Mes</th>
                <th>Costo/Mes</th>
                <th>Prioridad</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-f>
              <tr>
                <td><a [routerLink]="['/frictions', f.id]">{{ f.title }}</a></td>
                <td>{{ getCategoryLabel(f.category) }}</td>
                <td>{{ f.monthly_hours_lost | number:'1.1-1' }}h</td>
                <td>\${{ f.estimated_monthly_cost | number:'1.0-0' }}</td>
                <td><p-tag [value]="f.priority" [severity]="getPrioritySeverity(f.priority)" /></td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr><td colspan="5" class="text-center p-3">Sin datos aún</td></tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  data: DashboardData | null = null;
  categoryChartData: any;
  priorityChartData: any;
  chartOptions = { indexAxis: 'y' as const, plugins: { legend: { display: false } } };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getDashboard().subscribe((d) => {
      this.data = d;
      this.buildCharts(d);
    });
  }

  buildCharts(d: DashboardData) {
    this.categoryChartData = {
      labels: d.by_category.map((c) => this.getCategoryLabel(c.category)),
      datasets: [
        {
          data: d.by_category.map((c) => c.count),
          backgroundColor: '#3b82f6',
        },
      ],
    };

    this.priorityChartData = {
      labels: d.by_priority.map((p) => p.priority),
      datasets: [
        {
          data: d.by_priority.map((p) => p.count),
          backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
        },
      ],
    };
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
