import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService, Employee } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit {
  employeeForm!: FormGroup;
  loading = false;
  fetchLoading = true;
  uploadingPhoto = false;
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  employeeId = '';
  originalEmployee: Employee | null = null;

  departments = [
    'Engineering', 'Marketing', 'Human Resources', 'Finance',
    'Sales', 'Operations', 'Product', 'Design', 'Legal', 'IT Support'
  ];

  designations = [
    'Software Engineer', 'Senior Engineer', 'Tech Lead', 'Engineering Manager',
    'Product Manager', 'Designer', 'UX Researcher', 'Data Analyst',
    'HR Manager', 'Recruiter', 'Financial Analyst', 'Accountant',
    'Sales Representative', 'Marketing Specialist', 'DevOps Engineer',
    'QA Engineer', 'Business Analyst', 'Project Manager', 'Director', 'VP'
  ];

  genders = ['Male', 'Female', 'Other'];
  maxDate = new Date();

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.employeeId) { this.router.navigate(['/employees']); return; }

    this.employeeForm = this.fb.group({
      first_name:      ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      last_name:       ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email:           ['', [Validators.required, Validators.email]],
      gender:          ['', Validators.required],
      salary:          [null, [Validators.required, Validators.min(0)]],
      date_of_joining: ['', Validators.required],
      department:      ['', Validators.required],
      designation:     ['', Validators.required],
      employee_photo:  ['']
    });

    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (emp) => {
        this.originalEmployee = emp;
        this.fetchLoading = false;
        // FIX 1: patch each field explicitly - spread loses type coercion
        this.employeeForm.patchValue({
          first_name:      emp.first_name,
          last_name:       emp.last_name,
          email:           emp.email,
          gender:          emp.gender,
          salary:          Number(emp.salary),
          // FIX 2: handle both ISO string and numeric timestamp from MongoDB
          date_of_joining: new Date(isNaN(Number(emp.date_of_joining))
            ? emp.date_of_joining
            : Number(emp.date_of_joining)),
          department:      emp.department,
          designation:     emp.designation,
          employee_photo:  emp.employee_photo || ''
        });
        if (emp.employee_photo) this.previewUrl = emp.employee_photo;
      },
      error: (err) => {
        this.fetchLoading = false;
        this.snackBar.open(err.message, 'Close', { duration: 4000, panelClass: ['error-snack'] });
        this.router.navigate(['/employees']);
      }
    });
  }

  get f() { return this.employeeForm.controls; }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (!['image/jpeg','image/png','image/gif','image/webp'].includes(file.type)) {
      this.snackBar.open('Only image files allowed', 'Close', { duration: 4000, panelClass: ['error-snack'] });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.snackBar.open('Max file size is 5MB', 'Close', { duration: 4000, panelClass: ['error-snack'] });
      return;
    }
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => { this.previewUrl = reader.result as string; };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.employeeForm.patchValue({ employee_photo: '' });
  }

  private uploadPhotoAndGetUrl(): Promise<string> {
    if (!this.selectedFile) {
      return Promise.resolve(this.originalEmployee?.employee_photo || '');
    }
    this.uploadingPhoto = true;
    return new Promise((resolve, reject) => {
      this.employeeService.uploadPhoto(this.selectedFile!).subscribe({
        next: (res) => { this.uploadingPhoto = false; resolve(res.url); },
        error: (err) => { this.uploadingPhoto = false; reject(err); }
      });
    });
  }

  async onSubmit(): Promise<void> {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      const invalid = Object.keys(this.employeeForm.controls)
        .filter(k => this.employeeForm.controls[k].invalid);
      this.snackBar.open(`Please fix: ${invalid.join(', ')}`, 'Close',
        { duration: 5000, panelClass: ['error-snack'] });
      return;
    }

    this.loading = true;
    try {
      const photoUrl = await this.uploadPhotoAndGetUrl();

      // FIX 3: build input manually - never spread raw form value into GraphQL
      const input = {
        first_name:      this.employeeForm.value.first_name,
        last_name:       this.employeeForm.value.last_name,
        email:           this.employeeForm.value.email,
        gender:          this.employeeForm.value.gender,
        salary:          parseFloat(this.employeeForm.value.salary),
        date_of_joining: new Date(this.employeeForm.value.date_of_joining).toISOString(),
        department:      this.employeeForm.value.department,
        designation:     this.employeeForm.value.designation,
        employee_photo:  photoUrl
      };

      this.employeeService.updateEmployee(this.employeeId, input).subscribe({
        next: (updated) => {
          this.loading = false;
          this.snackBar.open(
            `${updated.first_name} ${updated.last_name} updated! ✅`,
            'Close', { duration: 3000, panelClass: ['success-snack'] }
          );
          this.router.navigate(['/employees', this.employeeId]);
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open(err.message || 'Update failed', 'Close',
            { duration: 5000, panelClass: ['error-snack'] });
        }
      });
    } catch (err: any) {
      this.loading = false;
      this.snackBar.open(err?.message || 'Something went wrong', 'Close',
        { duration: 5000, panelClass: ['error-snack'] });
    }
  }
}
