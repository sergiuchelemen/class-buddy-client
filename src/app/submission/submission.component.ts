import {Component, OnInit, ViewChild} from '@angular/core';
import {ClassroomService} from '../service/classroom.service';
import {NotificationService} from '../service/notification.service';
import {AuthService} from '../service/auth.service';
import {ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {GradeDialogComponent} from '../grade-dialog/grade-dialog.component';

@Component({
  selector: 'app-submission',
  imports: [
    FormsModule,
    NgForOf,
    DatePipe,
    GradeDialogComponent,
    NgIf
  ],
  templateUrl: './submission.component.html',
  styleUrl: './submission.component.css'
})
export class SubmissionComponent implements OnInit {
  @ViewChild(GradeDialogComponent) gradeDialogComponent!: GradeDialogComponent;

  public submissions: any[] = [];
  private homeworkId!: number;

  public constructor(private classroomService: ClassroomService,
                     private notificationService: NotificationService,
                     private authService: AuthService,
                     private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.homeworkId = +routeParams.get('homeworkId')!;
    this.loadSubmissions();
  }

  private loadSubmissions() {
    this.classroomService.getSubmissions(this.homeworkId).subscribe({
      next: (response: any[]) => {
        this.submissions = response;
        console.log(this.submissions);
      },
      error: () => {
        this.notificationService.showErrorNotification();
      }
    });
  }

  downloadSubmission(sub: any) {
    const filename = sub.fileName;

    this.classroomService.downloadFile(filename).subscribe({
      next: (blob: Blob | MediaSource) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        a.download = filename;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
      },
      error: (err: any) => {
        console.error('Download failed', err);
        this.notificationService.showErrorNotification();
      }
    });
  }

  async saveGrade(sub: any) {
    const grade = await this.gradeDialogComponent.open();
    if (grade == null) {
      return;
    }
    this.classroomService
      .submitGrade(sub.id, grade)
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.loadSubmissions();
        },
        error: () => this.notificationService.showErrorNotification()
      });
  }
}
