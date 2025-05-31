import {Component, OnInit, ViewChild} from '@angular/core';
import {ClassroomService} from '../service/classroom.service';
import {NotificationService} from '../service/notification.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {AuthService} from '../service/auth.service';
import {SubmissionDialogComponent} from '../submission-dialog/submission-dialog.component';

@Component({
  selector: 'app-homework',
  imports: [
    DatePipe,
    NgIf,
    NgForOf,
    SubmissionDialogComponent,
    RouterLink
  ],
  templateUrl: './homework.component.html',
  styleUrl: './homework.component.css'
})
export class HomeworkComponent implements OnInit {

  @ViewChild(SubmissionDialogComponent) public submissionDialog!: SubmissionDialogComponent;

  public classroomId!: number;
  public homeworks: any[] = [];

  private routeSub!: Subscription;
  private currentUser: any;
  private ownerId!: number;

  public constructor(private authService: AuthService,
                     private route: ActivatedRoute,
                     private classroomService: ClassroomService,
                     private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    const routeParams = this.route.snapshot.paramMap;
    this.classroomId = +routeParams.get('classroomId')!;

    this.classroomService.getClassroom(this.classroomId).subscribe({
      next: (response: any) => {
        this.ownerId = response.owner.id;
      },
      error: () => {
        this.notificationService.showErrorNotification();
      }
    });

    this.getAllHomeworks();
  }

  getAllHomeworks() {
    this.classroomService.getAllHomework(this.classroomId).subscribe({
      next: (response) => {
        this.homeworks = response;
      },
      error: err => {
        this.notificationService.showErrorNotification();
      }
    })
  }

  onDownload(hw: any) {
    const filename = hw.fileName;

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

  public isOwner() {
    return this.currentUser.id == this.ownerId;
  }

  async onAddSubmission(hw: any) {
    const files = await this.submissionDialog.open();

    this.classroomService.submitFiles(hw.id, files).subscribe({
      next: (response) => {

      },
      error: () => {
        this.notificationService.showErrorNotification();
      }
    })
  }
}
