import { Component } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    NgIf
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  visible = false;
  message: string = 'Are you sure?';
  private resolveFn!: (result: boolean) => void;

  open(message: string = 'Are you sure?'): Promise<boolean> {
    this.message = message;
    this.visible = true;
    return new Promise<boolean>(resolve => this.resolveFn = resolve);
  }

  confirm(): void {
    this.visible = false;
    this.resolveFn(true);
  }

  cancel(): void {
    this.visible = false;
    this.resolveFn(false);
  }
}
