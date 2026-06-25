import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FrictionService } from '../../core/services/friction.service';
import { Friction } from '../../core/models/friction.model';
import { Priority, prioritySeverity } from '../../core/models/enums';

@Component({
  selector: 'app-friction-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TableModule, TagModule, CardModule],
  templateUrl: './friction-list.component.html',
})
export class FrictionListComponent implements OnInit {
  private service = inject(FrictionService);
  private router = inject(Router);
  private confirm = inject(ConfirmationService);
  private messages = inject(MessageService);

  frictions: Friction[] = [];
  loading = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.list().subscribe({
      next: (data) => {
        this.frictions = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messages.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las fricciones.' });
      },
    });
  }

  severity(p: string) {
    return prioritySeverity(p as Priority);
  }

  view(f: Friction): void {
    this.router.navigate(['/frictions', f.id]);
  }

  edit(f: Friction): void {
    this.router.navigate(['/frictions', f.id, 'edit']);
  }

  remove(f: Friction): void {
    this.confirm.confirm({
      message: `¿Eliminar la fricción "${f.title}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(f.id).subscribe({
          next: () => {
            this.messages.add({ severity: 'success', summary: 'Eliminada', detail: f.title });
            this.load();
          },
          error: () =>
            this.messages.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar.' }),
        });
      },
    });
  }
}
