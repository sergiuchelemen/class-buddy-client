import { Component } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-delete-classroom-dialog',
  imports: [
    NgIf
  ],
  templateUrl: './delete-classroom-dialog.component.html',
  styleUrl: './delete-classroom-dialog.component.css'
})
export class DeleteClassroomDialogComponent {
  visible = false;
  message: string = 'Are you sure you want to permanently delete this classroom? This action cannot be undone.';
  private resolveFn!: (result: boolean) => void;

  open(): Promise<boolean> {
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
