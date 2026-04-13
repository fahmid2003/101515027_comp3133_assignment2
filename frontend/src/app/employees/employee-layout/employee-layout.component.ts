import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-layout',
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 64px);
      background: #f1f5f9;
      padding: 0;
    }
  `]
})
export class EmployeeLayoutComponent {}
