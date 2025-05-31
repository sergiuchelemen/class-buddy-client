import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY  = 'current_user';

  private _currentUser = new BehaviorSubject<any | null>(null);
  public currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);
    if (token && userJson) {
      try {
        this._currentUser.next(JSON.parse(userJson));
      } catch {
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
      }
    }
  }

  login(loginRequest: any) {
    return this.http
      .post<{ accessToken: string; user: any }>(
        `${environment.apiBaseUrl}/login`,
        loginRequest
      )
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.accessToken);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
          this._currentUser.next(response.user);
        })
      );
  }

  register(registerRequest: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/register`,
      registerRequest
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._currentUser.next(null);
    this.router.navigate(['/']);
  }
}
