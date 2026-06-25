import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../core/models/dashboard.model';
import { Priority, prioritySeverity } from '../../core/models/enums';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    TableModule,
    TagModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styles: [
    `.metric { font-size: 2rem; font-weight: 700; color: #1d4ed8; }
     .metric-label { color: #6b7280; }
     .grid-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
     .grid-tables { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
     @media (max-width: 900px) { .grid-cards, .grid-tables { grid-template-columns: 1fr; } }`,
  ],
})
export class DashboardComponent implements OnInit {
  private service = inject(DashboardService);
  summary?: DashboardSummary;
  loading = true;
  error = false;

  ngOnInit(): void {
    this.service.summary().subscribe({
      next: (s) => {
        this.summary = s;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  severity(p: string) {
    return prioritySeverity(p as Priority);
  }
}
