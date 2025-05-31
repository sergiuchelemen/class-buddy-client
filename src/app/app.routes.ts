import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {ClassbuddyComponent} from './classbuddy/classbuddy.component';
import {AuthGuard} from './guards/auth.guard';
import {ClassroomDetailComponent} from './classroom-detail/classroom-detail.component';
import {AnnouncementDetailComponent} from './announce-detail/announcement-detail.component';
import {HomeworkComponent} from './homework/homework.component';
import {SubmissionComponent} from './submission/submission.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'home',
    component: ClassbuddyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'classrooms/:id',
    component: ClassroomDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'classrooms/:classroomId/announcement/:id',
    component: AnnouncementDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'classrooms/:classroomId/homework',
    component: HomeworkComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'classrooms/:classroomId/homework/:homeworkId',
    component: SubmissionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
