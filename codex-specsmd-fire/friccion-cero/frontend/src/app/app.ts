import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, ConfirmDialogModule, RouterLink, RouterLinkActive, RouterOutlet, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'pi pi-chart-bar' },
    { label: 'Fricciones', path: '/frictions', icon: 'pi pi-list' },
    { label: 'Nueva friccion', path: '/frictions/new', icon: 'pi pi-plus' },
    { label: 'Iniciativas', path: '/initiatives', icon: 'pi pi-bolt' }
  ];
}
