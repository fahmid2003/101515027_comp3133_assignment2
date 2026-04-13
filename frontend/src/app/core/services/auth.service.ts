import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { LOGIN_QUERY, SIGNUP_MUTATION } from '../../graphql/queries';

export interface User {
  _id: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  constructor(private apollo: Apollo, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.apollo
      .query<any>({
        query: LOGIN_QUERY,
        variables: { username, password }
      })
      .pipe(
        map(result => result.data.login),
        tap(data => {
          localStorage.setItem(this.TOKEN_KEY, data.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
        }),
        catchError(err => {
          const msg = err.graphQLErrors?.[0]?.message || err.message || 'Login failed';
          return throwError(() => new Error(msg));
        })
      );
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.apollo
      .mutate<any>({
        mutation: SIGNUP_MUTATION,
        variables: { username, email, password }
      })
      .pipe(
        map(result => result.data.signup),
        catchError(err => {
          const msg = err.graphQLErrors?.[0]?.message || err.message || 'Signup failed';
          return throwError(() => new Error(msg));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.apollo.client.resetStore();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}
