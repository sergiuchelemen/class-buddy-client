import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './polyfills';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
