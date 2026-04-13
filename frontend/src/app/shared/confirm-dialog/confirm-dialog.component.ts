import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="dialog-container">
      <div class="dialog-icon">
        <mat-icon>warning_amber</mat-icon>
      </div>
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-stroked-button [mat-dialog-close]="false">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button mat-raised-button color="warn" [mat-dialog-close]="true">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container { padding: 8px; text-align: center; }
    .dialog-icon {
      display: flex; justify-content: center; margin-bottom: 8px;
      mat-icon { font-size: 48px; width: 48px; height: 48px; color: #f59e0b; }
    }
    h2 { font-size: 22px; font-weight: 700; color: #1e293b; }
    p { color: #64748b; font-size: 15px; }
    mat-dialog-actions { gap: 8px; padding-bottom: 8px !important; }
    button { border-radius: 8px !important; min-width: 100px; }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
