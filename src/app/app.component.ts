import {Component, OnInit, ViewChild} from '@angular/core';
import {LoaderService} from './service/loader.service';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatSidenavContainer, MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbar, MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule, MatNavList} from '@angular/material/list';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {JoinClassroomDialogComponent} from './join-classroom-dialog/join-classroom-dialog.component';
import {CreateClassroomDialogComponent} from './create-classroom-dialog/create-classroom-dialog.component';
import {NotificationService} from './service/notification.service';
import {AuthService} from './service/auth.service';
import {ClassroomService} from './service/classroom.service';
import {filter} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [NgIf,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule, AsyncPipe, RouterOutlet, MatSidenavContainer, MatToolbar, MatIcon, ConfirmDialogComponent, JoinClassroomDialogComponent, CreateClassroomDialogComponent, RouterLink, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;
  @ViewChild(JoinClassroomDialogComponent) joinClassroomDialog!: JoinClassroomDialogComponent;
  @ViewChild(CreateClassroomDialogComponent) createClassroomDialog!: CreateClassroomDialogComponent;

  public owned: any[] = [];
  public enrolled: any[] = [];

  public showSidenav = true;
  private authRoutes = ['/', '/login', '/register'];

  constructor(public loader: LoaderService,
              private router: Router,
              private loaderService: LoaderService,
              private notificationService: NotificationService,
              private authService: AuthService,
              private classroomService: ClassroomService) {
  }

  ngOnInit(): void {
    this.classroomService.ownedClassrooms$.subscribe(list => {
      this.owned = list;
    });

    this.classroomService.enrolledClassrooms$.subscribe(list => {
      this.enrolled = list;
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects;
        this.showSidenav = !this.authRoutes.includes(currentUrl);
      });

    this.authService.currentUser$.subscribe(() => {
      this.reload();
    });
  }

  private reload() {
    this.loaderService.start();

    this.classroomService.getAllClassrooms()
      .subscribe({
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

  async onLogout() {
    const confirmed = await this.confirmDialog.open('Do you really want to log out?');
    if (confirmed) {
      this.authService.logout();
    }
  }

  async onCreateClassroom() {
    const data = await this.createClassroomDialog.open();

    if (!data) {
      return;
    }

    // 3. Otherwise, pass along the real form values
    this.classroomService.createClassroom(data).subscribe({
      next: () => {
        this.notificationService.showSuccessNotification(
          `Classroom “${data.name}” created successfully!`
        );
        this.reload();
      },
      error: (err) => {
        console.error('Create failed:', err);
        this.notificationService.showErrorNotification(
          `Could not create classroom “${data.name}”. Please try again.`
        );
      }
    });
  }


  async onJoinClassroom() {
    const code = await this.joinClassroomDialog.open();

    if (!code) {
      return;
    }

    this.classroomService.joinClassroom(code).subscribe({
      next: () => {
        this.notificationService.showSuccessNotification(
          `Successfully joined classroom “${code}”!`
        );
        this.reload();
      },
      error: (err) => {
        this.notificationService.showErrorNotification(
          `Could not join classroom “${code}”. Please check your code and try again.`
        );
      }
    });
  }
}
