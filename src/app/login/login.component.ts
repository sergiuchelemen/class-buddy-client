import {Component, OnInit} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {AuthService} from '../service/auth.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoaderService} from '../service/loader.service';
import {NotificationService} from '../service/notification.service';
import {ClassroomService} from '../service/classroom.service';

@Component({
  selector: 'app-login',
  imports: [
    NgOptimizedImage,
    NavBarComponent,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected router: Router,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private classroomService: ClassroomService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  login() {
    this.loaderService.start();

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.loaderService.stop();
        this.notificationService.showSuccessNotification('Login successful!');
        this.getClassrooms();
      },
      error: (err: any) => {
        console.error(err);
        this.loaderService.stop();
        this.notificationService.showErrorNotification('Login failed. Please try again.');
      }
    });
  }

  private getClassrooms(): void {
    this.classroomService.getAllClassrooms()
      .subscribe({
        next: ({ owned, enrolled }) => {
          this.loaderService.stop();

          let firstClassroomId: number | null = null;

          if (owned && owned.length > 0) {
            firstClassroomId = owned[0].id;
          } else if (enrolled && enrolled.length > 0) {
            firstClassroomId = enrolled[0].id;
          }

          if (firstClassroomId !== null) {
            this.router.navigateByUrl(`/classrooms/${firstClassroomId}`);
          }
          else {
            this.router.navigateByUrl(`/home`);
          }

        },
        error: () => {
          this.notificationService.showErrorNotification('Could not load classrooms.');
          this.loaderService.stop();
        }
      });
  }

}
