import {Component, OnInit} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {AuthService} from '../service/auth.service';
import {NotificationService} from '../service/notification.service';
import {LoaderService} from '../service/loader.service';


@Component({
  selector: 'app-register',
  imports: [
    NgOptimizedImage,
    FormsModule,
    NavBarComponent,
    ReactiveFormsModule,
    NgIf
  ],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  confirmPassword: any;
  password: any;
  registerForm!: FormGroup;

  constructor(
    protected router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
    });
  }

  register() {
    this.loaderService.start();

    this.authService.register(this.registerForm.value).subscribe({
      next: (response: any) => {
        console.log(response);
        this.loaderService.stop();
        this.notificationService.showSuccessNotification('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error(err);
        this.loaderService.stop();
        this.notificationService.showErrorNotification('Registration failed. Please try again.');
      }
    });
  }


  passwordsDoNotMatch(): boolean {
    const pw = this.registerForm.get('password')?.value;
    const cp = this.registerForm.get('confirmPassword')?.value;
    return pw && cp && pw !== cp;
  }
}
