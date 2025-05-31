import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-grade-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './grade-dialog.component.html',
  styleUrls: ['./grade-dialog.component.css'],
})
export class GradeDialogComponent {
  visible = false;

  form: FormGroup;

  private resolveFn!: (
    value: number | null
  ) => void;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      grade: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
        ],
      ],
    });
  }

  open(currentGrade: number | null = null): Promise<number | null> {
    this.visible = true;

    // If caller passes an existing grade, patch it so user can edit.
    if (currentGrade !== null) {
      this.form.patchValue({ grade: currentGrade });
    } else {
      this.form.reset();
    }

    return new Promise((resolve) => {
      this.resolveFn = resolve;
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const gradeValue = this.form.value.grade;
    this.visible = false;
    this.resolveFn(gradeValue);
    this.form.reset();
  }

  cancel(): void {
    this.visible = false;
    this.resolveFn(null);
    this.form.reset();
  }
}
