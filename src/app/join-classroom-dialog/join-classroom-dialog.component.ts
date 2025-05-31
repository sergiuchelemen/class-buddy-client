import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-join-classroom-dialog',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './join-classroom-dialog.component.html',
  styleUrl: './join-classroom-dialog.component.css'
})
export class JoinClassroomDialogComponent {
  visible = false;
  codeControl = new FormControl('', Validators.required);
  private resolveFn!: (code: string | null) => void;

  open(): Promise<string | null> {
    this.visible = true;
    return new Promise(resolve => (this.resolveFn = resolve));
  }

  confirm(): void {
    if (this.codeControl.invalid) {
      this.codeControl.markAsTouched();
      return;
    }
    this.visible = false;
    this.resolveFn(this.codeControl.value);
    this.codeControl.reset();
  }

  cancel(): void {
    this.visible = false;
    this.resolveFn(null);
    this.codeControl.reset();
  }
}
