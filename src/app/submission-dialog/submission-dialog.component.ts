import { Component } from '@angular/core';
import { NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-submission-dialog',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './submission-dialog.component.html',
  styleUrls: ['./submission-dialog.component.css']
})
export class SubmissionDialogComponent {
  /** Controls overlay visibility */
  visible = false;

  /** Holds the list of selected files */
  files: File[] = [];

  /** Internal resolver for the `open()` promise */
  private resolveFn!: (value: File[] | null) => void;

  /**
   * Call this to show the dialog. Returns a Promise that resolves
   * to an array of Files (if “Submit” was clicked) or null (if “Cancel”).
   */
  open(): Promise<File[] | null> {
    this.visible = true;
    return new Promise(resolve => {
      this.resolveFn = resolve;
    });
  }

  /**
   * Handler for when the user picks files via the <input type="file">.
   * We convert the FileList into an array and append it to `this.files`.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) {
      return;
    }
    const selectedFiles = Array.from(input.files);
    this.files = this.files.concat(selectedFiles);

    // Clear the native input so that picking the same file twice triggers change again
    input.value = '';
  }

  /**
   * Remove one file from the list (when the user clicks the “×” next to it).
   */
  removeFile(fileToRemove: File): void {
    this.files = this.files.filter(f => f !== fileToRemove);
  }

  /**
   * User clicks “Submit.” Resolve with the list of files and close the dialog.
   */
  submit(): void {
    this.visible = false;
    this.resolveFn(this.files);
    this.reset();
  }

  /**
   * User clicks “Cancel.” Resolve with null and close the dialog.
   */
  cancel(): void {
    this.visible = false;
    this.resolveFn(null);
    this.reset();
  }

  /** Reset internal state (clear file list) */
  private reset(): void {
    this.files = [];
  }
}
