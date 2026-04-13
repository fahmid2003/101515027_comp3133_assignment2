import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent implements OnInit {
  employeeForm!: FormGroup;
  loading = false;
  uploadingPhoto = false;
  previewUrl: string | null = null;
  selectedFile: File | null = null;

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
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0), Validators.max(9999999)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      employee_photo: ['']
    });
  }

  get f() { return this.employeeForm.controls; }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const maxSize = 5 * 1024 * 1024;
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowed.includes(file.type)) {
      this.snackBar.open('Only image files (JPG, PNG, GIF, WEBP) are allowed', 'Close', {
        duration: 4000, panelClass: ['error-snack']
      });
      return;
    }

    if (file.size > maxSize) {
      this.snackBar.open('File size must be under 5MB', 'Close', {
        duration: 4000, panelClass: ['error-snack']
      });
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

  async uploadPhotoAndGetUrl(): Promise<string> {
    if (!this.selectedFile) return '';
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
      return;
    }

    this.loading = true;
    try {
      let photoUrl = '';
      if (this.selectedFile) {
        photoUrl = await this.uploadPhotoAndGetUrl();
      }

      const formValue = { ...this.employeeForm.value };
      formValue.salary = parseFloat(formValue.salary);
      formValue.date_of_joining = new Date(formValue.date_of_joining).toISOString();
      formValue.employee_photo = photoUrl;

      this.employeeService.addEmployee(formValue).subscribe({
        next: () => {
          this.snackBar.open('Employee added successfully! ✅', 'Close', {
            duration: 3000, panelClass: ['success-snack']
          });
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open(err.message, 'Close', { duration: 4000, panelClass: ['error-snack'] });
        }
      });
    } catch (err: any) {
      this.loading = false;
      this.snackBar.open('Failed to upload photo. Please try again.', 'Close', {
        duration: 4000, panelClass: ['error-snack']
      });
    }
  }
}
