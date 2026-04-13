import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EmployeeService, Employee } from '../../core/services/employee.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'employee_photo', 'first_name', 'email', 'department',
    'designation', 'salary', 'date_of_joining', 'actions'
  ];

  dataSource = new MatTableDataSource<Employee>([]);
  loading = false;
  searchLoading = false;
  totalCount = 0;

  searchTerm = '';
  searchType: 'department' | 'designation' = 'department';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadEmployees(): void {
    this.loading = true;
    this.searchTerm = '';
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.dataSource.data = employees;
        this.totalCount = employees.length;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.message, 'Close', { duration: 4000, panelClass: ['error-snack'] });
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.trim();
    if (!term) {
      this.loadEmployees();
      return;
    }
    this.searchLoading = true;
    const search$ = this.searchType === 'department'
      ? this.employeeService.searchByDepartment(term)
      : this.employeeService.searchByDesignation(term);

    search$.subscribe({
      next: (employees) => {
        this.dataSource.data = employees;
        this.totalCount = employees.length;
        this.searchLoading = false;
      },
      error: (err) => {
        this.searchLoading = false;
        this.snackBar.open(err.message, 'Close', { duration: 4000, panelClass: ['error-snack'] });
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadEmployees();
  }

  viewEmployee(id: string): void {
    this.router.navigate(['/employees', id]);
  }

  editEmployee(id: string): void {
    this.router.navigate(['/employees', id, 'edit']);
  }

  deleteEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Delete Employee',
        message: `Are you sure you want to delete ${employee.first_name} ${employee.last_name}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.employeeService.deleteEmployee(employee._id).subscribe({
          next: (msg) => {
            this.snackBar.open(msg || 'Employee deleted successfully', 'Close', {
              duration: 3000, panelClass: ['success-snack']
            });
            this.loadEmployees();
          },
          error: (err) => {
            this.snackBar.open(err.message, 'Close', { duration: 4000, panelClass: ['error-snack'] });
          }
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
