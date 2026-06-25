import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InitiativeService } from '../../core/services/initiative.service';
import { FrictionService } from '../../core/services/friction.service';
import { Initiative } from '../../core/models/initiative.model';
import { Priority, prioritySeverity } from '../../core/models/enums';

@Component({
  selector: 'app-initiative-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TableModule, TagModule, CardModule],
  templateUrl: './initiative-list.component.html',
})
export class InitiativeListComponent implements OnInit {
  private service = inject(InitiativeService);
  private frictionService = inject(FrictionService);
  private router = inject(Router);
  private confirm = inject(ConfirmationService);
  private messages = inject(MessageService);

  initiatives: Initiative[] = [];
  frictionTitles = new Map<number, string>();
  loading = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    forkJoin({
      initiatives: this.service.list(),
      frictions: this.frictionService.list(),
    }).subscribe({
      next: ({ initiatives, frictions }) => {
        this.initiatives = initiatives;
        this.frictionTitles = new Map(frictions.map((f) => [f.id, f.title]));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messages.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las iniciativas.' });
      },
    });
  }

  frictionTitle(id: number): string {
    return this.frictionTitles.get(id) ?? `#${id}`;
  }

  severity(p: string) {
    return prioritySeverity(p as Priority);
  }

  remove(i: Initiative): void {
    this.confirm.confirm({
      message: `¿Eliminar la iniciativa "${i.title}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(i.id).subscribe({
          next: () => {
            this.messages.add({ severity: 'success', summary: 'Eliminada', detail: i.title });
            this.load();
          },
          error: () =>
            this.messages.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar.' }),
        });
      },
    });
  }
}
