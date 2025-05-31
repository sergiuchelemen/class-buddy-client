import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private defaultConfig: MatSnackBarConfig = {
    duration: 2000,
    verticalPosition: 'bottom' as MatSnackBarVerticalPosition,
    horizontalPosition: 'center' as MatSnackBarHorizontalPosition,
  };

  constructor(private snackBar: MatSnackBar) {}

  public showSuccessNotification(message: string = 'Operation completed successfully!') {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      panelClass: ['mat-toolbar', 'mat-primary']
    });
  }

  public showErrorNotification(message: string = 'Something went wrong. Please try again.') {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      panelClass: ['mat-toolbar', 'mat-warn']
    });
  }
}

