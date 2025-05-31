import {Component, OnInit, ViewChild} from '@angular/core';
import {ClassroomService} from '../service/classroom.service';
import {NotificationService} from '../service/notification.service';
import {ActivatedRoute, RouterLink, Router, ParamMap} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {LoaderService} from '../service/loader.service';
import {AuthService} from '../service/auth.service';
import {HomeworkDialogComponent} from '../homework-dialog/homework-dialog.component';
import {Subscription} from 'rxjs';
import {DeleteClassroomDialogComponent} from '../delete-classroom-dialog/delete-classroom-dialog.component';

@Component({
  selector: 'app-classroom-detail',
  imports: [
    FormsModule,
    DatePipe,
    NgForOf,
    RouterLink,
    NgClass,
    NgIf,
    HomeworkDialogComponent,
    DeleteClassroomDialogComponent
  ],
  templateUrl: './classroom-detail.component.html',
  styleUrl: './classroom-detail.component.css'
})
export class ClassroomDetailComponent implements OnInit {

  @ViewChild('homeworkDialog') homeworkDialog!: HomeworkDialogComponent;
  @ViewChild('deleteClassroomDialog') deleteClassroomDialog!: DeleteClassroomDialogComponent;

  public announcements: any[] = [];
  public homeworks: any[] = [];
  public classroom: any;
  private ownerId: number = -1;

  public classroomId!: number;
  public newAnnouncement: string = '';
  public newComment: { [annId: number]: string } = {};
  public currentUser: any;

  owned: any[] = [];
  enrolled: any[] = [];

  private routeSub!: Subscription;

  constructor(private classroomService: ClassroomService,
              private notificationService: NotificationService,
              private loaderService: LoaderService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadClassrooms();

    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');
      if (!idParam) {
        return;
      }

      this.classroomId = Number(idParam);

      this.classroomService.getClassroom(this.classroomId).subscribe({
        next: (response: any) => {
          this.classroom = response;
          this.ownerId = response.owner.id;
        },
        error: () => {
          this.notificationService.showErrorNotification();
        }
      });

      this.loadAnnouncements();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  private loadClassrooms() {
    this.classroomService.getAllClassrooms().subscribe({
      next: ({ owned, enrolled }) => {
        this.owned = owned;
        this.enrolled = enrolled;
        this.loaderService.stop();
      },
      error: () => {
        this.notificationService.showErrorNotification('Could not load classrooms.');
        this.loaderService.stop();
      }
    });
  }

  public submitComment(annId: number): void {
    if (this.newComment[annId].length === 0 || this.newComment == '') {
      return;
    }

    this.loaderService.start();
    this.classroomService.addComment(annId, this.newComment[annId])
      .subscribe({
        next: (_response: any) => {
          this.loaderService.stop();
          this.notificationService.showSuccessNotification();
          this.newComment[annId] = '';
          this.loadAnnouncements();
        },
        error: (err: any) => {
          this.loaderService.stop();
          this.notificationService.showErrorNotification();
        }
      });
  }

  public addAnnouncement(): void {
    if (this.newAnnouncement == '') {
      return;
    }

    this.loaderService.start();
    this.classroomService.createAnnouncement(this.classroomId, this.newAnnouncement)
      .subscribe({
        next: (_response: any) => {
          this.loaderService.stop();
          this.notificationService.showSuccessNotification();
          this.newAnnouncement = '';
          this.loadAnnouncements();
        },
        error: (err: any) => {
          this.loaderService.stop();
          this.notificationService.showErrorNotification();
        }
      });
  }


  private loadAnnouncements() {
    this.classroomService.getAnnouncements(this.classroomId).subscribe({
      next: (response: any[]) => {
        this.announcements = response;
      },
      error: (error) => {
        this.notificationService.showErrorNotification('Error loading announcements');
      },
    })
  }

  public isOwner() {
    return this.currentUser.id == this.ownerId;
  }

  public copyCode() {
    navigator.clipboard.writeText(this.classroom.code)
      .then(() => {})
      .catch(() => {});
  }

  async onShowHomeworkDialog() {
    const res = await this.homeworkDialog.open();
    if (res == null) {
      return;
    }
    this.classroomService.addHomework(this.classroomId, res?.title, res?.description, res?.files[0], res?.dueDate).subscribe({
      next: (res) => {
        this.notificationService.showSuccessNotification();
      },
      error: () => {
        this.notificationService.showErrorNotification();
      }
    })
  }

  async onDeleteClassroom() {
    const res = await this.deleteClassroomDialog.open();
    if (!res) {
      return;
    }

    this.classroomService.deleteClassroom(this.classroomId).subscribe({
      next: () => {
        this.classroomService.getAllClassrooms()
          .subscribe({
            next: ({owned, enrolled}) => {

              let firstId: number | null = null;
              if (owned && owned.length > 0) {
                firstId = owned[0].id;
              } else if (enrolled && enrolled.length > 0) {
                firstId = enrolled[0].id;
              }

              if (firstId !== null) {
                this.router.navigateByUrl(`/classrooms/${firstId}`);
              } else {
                this.router.navigateByUrl(`/home`);
              }

              this.notificationService.showSuccessNotification();
            },
            error: () => {
              this.notificationService.showErrorNotification();
            }
          });
      },
      error: () => {
        this.notificationService.showErrorNotification();
      }
    });
  }

}
