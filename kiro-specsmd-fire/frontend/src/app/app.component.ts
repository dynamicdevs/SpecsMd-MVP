import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout-wrapper">
      <aside class="layout-sidebar">
        <div class="sidebar-header">
          <h2>🔥 Fricción Cero</h2>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active">
            <i class="pi pi-chart-bar"></i> Dashboard
          </a>
          <a routerLink="/frictions" routerLinkActive="active">
            <i class="pi pi-list"></i> Fricciones
          </a>
          <a routerLink="/initiatives" routerLinkActive="active">
            <i class="pi pi-bolt"></i> Iniciativas
          </a>
        </nav>
      </aside>
      <main class="layout-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      min-height: 100vh;
    }
    .layout-sidebar {
      width: 250px;
      background: #1e293b;
      color: white;
      padding: 1rem;
    }
    .sidebar-header h2 {
      font-size: 1.2rem;
      margin: 0 0 2rem 0;
      padding: 0.5rem;
    }
    .sidebar-nav a {
      display: block;
      padding: 0.75rem 1rem;
      color: #94a3b8;
      text-decoration: none;
      border-radius: 6px;
      margin-bottom: 0.25rem;
      transition: all 0.2s;
    }
    .sidebar-nav a:hover {
      color: white;
      background: #334155;
    }
    .sidebar-nav a.active {
      color: white;
      background: #3b82f6;
    }
    .sidebar-nav a i {
      margin-right: 0.5rem;
    }
    .layout-content {
      flex: 1;
      padding: 2rem;
      background: #f8fafc;
    }
  `],
})
export class AppComponent {}
