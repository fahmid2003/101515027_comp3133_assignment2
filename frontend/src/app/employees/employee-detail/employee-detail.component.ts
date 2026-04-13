import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService, Employee } from '../../core/services/employee.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/employees']); return; }

    this.employeeService.getEmployeeById(id).subscribe({
      next: (emp) => { this.employee = emp; this.loading = false; },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.message, 'Close', { duration: 4000, panelClass: ['error-snack'] });
        this.router.navigate(['/employees']);
      }
    });
  }

  editEmployee(): void {
    this.router.navigate(['/employees', this.employee!._id, 'edit']);
  }

  deleteEmployee(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Delete Employee',
        message: `Are you sure you want to delete ${this.employee!.first_name} ${this.employee!.last_name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.employeeService.deleteEmployee(this.employee!._id).subscribe({
          next: (msg) => {
            this.snackBar.open(msg || 'Employee deleted', 'Close', {
              duration: 3000, panelClass: ['success-snack']
            });
            this.router.navigate(['/employees']);
          },
          error: (err) => this.snackBar.open(err.message, 'Close', { duration: 4000, panelClass: ['error-snack'] })
        });
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return colors[hash % colors.length];
  }
}
