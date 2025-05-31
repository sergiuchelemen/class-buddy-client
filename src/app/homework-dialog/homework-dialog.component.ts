import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-homework-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf],
  templateUrl: './homework-dialog.component.html',
  styleUrls: ['./homework-dialog.component.css']
})
export class HomeworkDialogComponent {
  visible = false;
  form: FormGroup;
  files: File[] = [];
  private resolveFn!: (value: (PromiseLike<{ title: string; description: string; dueDate: Date; files: File[] } | null> | {
    title: string,
    description: string;
    dueDate: Date;
    files: File[]
  } | null)) => void;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  open(): Promise<{ title: string; description: string; dueDate: Date; files: File[] } | null> {
    this.visible = true;
    return new Promise(resolve => this.resolveFn = resolve);
  }

  removeFile(fileToRemove: any) {

    this.files = this.files.filter(f => f !== fileToRemove);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) { return; }

    // Convert FileList to Array<File>
    const selectedFiles = Array.from(input.files);
    // Append to existing:
    this.files = this.files.concat(selectedFiles);

    // If you want to clear the native input after selection:
    input.value = '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.visible = false;
    const { title, description, dueDate } = this.form.value;
    this.resolveFn({ title, description, dueDate, files: this.files });
    this.reset();
  }

  cancel(): void {
    this.visible = false;
    this.resolveFn(null);
    this.reset();
  }

  private reset(): void {
    this.form.reset();
    this.files = [];
  }
}
