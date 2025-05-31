import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-create-classroom-dialog',
  imports: [
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './create-classroom-dialog.component.html',
  styleUrl: './create-classroom-dialog.component.css'
})
export class CreateClassroomDialogComponent {
  visible = false;
  form: FormGroup;
  private resolveFn!: (data: { name: string; subject: string; code: string } | null) => void;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
    });
  }

  open(): Promise<{ name: string; subject: string; code: string } | null> {
    this.visible = true;
    return new Promise(resolve => this.resolveFn = resolve);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.visible = false;
    this.resolveFn(this.form.value);
    this.form.reset();
  }

  cancel(): void {
    this.visible = false;
    this.resolveFn(null);
    this.form.reset();
  }
}
