import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

interface LoginResponse {
  token: string;
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  getLocations(): Observable<any> {
    return this.http.get(this.apiUrl + "/locations", {headers: {Accept: 'application/json'}});
  }

  registerUser(username: string | null | undefined, email: string | null | undefined, password: string | null | undefined) {
    const body = {
      name: username,
      email: email,
      password: password
    };

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(this.apiUrl + '/api/users/register', body, {headers});
  }

  loginUser(email: string | null, password: string | null): Observable<LoginResponse> {
    const body = {
      email: email,
      password: password
    };
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<LoginResponse>(this.apiUrl + '/api/users/login', body, {headers}).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  logout(): Observable<any> {
    return this.http.post(this.apiUrl + '/api/users/logout', {});
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded: JwtPayload = jwtDecode(token);
      const now = Date.now();
      return decoded.exp * 1000 < now;
    } catch (e) {
      return true;
    }
  }

  checkTokenOnStartup(): void {
    if (this.isTokenExpired()) {
      localStorage.removeItem('token');
      console.log('Token expired. Cleared from storage.');
    } else {
      console.log('Token is valid.');
    }
  }

  me(): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.getToken()}`
    };

    return this.http.get(this.apiUrl + '/api/users/me', {headers});
  }

  updateUser(oldPassword: string | undefined, name: string | undefined, email: string | undefined, password: string | undefined): Observable<any> {
    const body: any = {};
    body.oldPassword = oldPassword;
    body.name = name;
    body.email = email;
    body.password = password;

    return this.http.patch(this.apiUrl + '/api/users/update', body, {});
  }

  deleteUser(): Observable<any> {
    return this.http.delete(this.apiUrl + '/api/users/delete', {});
  }

}






// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, map, tap, catchError, of } from 'rxjs';
//
// interface LoginResponse {
//   // Adjust these fields if your backend responds differently
//   token?: string;
//   success?: boolean;
//   message?: string;
// }
//
// @Injectable({
//   providedIn: 'root',
// })
// export class LoginService {
//   private authenticated = false;
//   private readonly baseUrl = 'http://localhost:3000/api/users/login';
//   private readonly tokenKey = 'advent_token';
//   private readonly authKey = 'advent_auth';
//
//   constructor(private http: HttpClient) {
//     // Restore auth state from storage (session-based by default)
//     const stored = localStorage.getItem(this.authKey);
//     this.authenticated = stored === 'true';
//   }
//
//   loginUser(email: string | null, password: string | null): Observable<boolean> {
//     const body = { email, password } as const;
//     return this.http.post<LoginResponse>(this.baseUrl, body).pipe(
//       map((res) => {
//         // Determine success
//         const ok = !!(res && (res.success || res.token));
//         return { ok, token: res?.token };
//       }),
//       tap(({ ok, token }) => {
//         this.authenticated = ok;
//         localStorage.setItem(this.authKey, String(ok));
//         if (ok && token) {
//           localStorage.setItem(this.tokenKey, token);
//         }
//       }),
//       map(({ ok }) => ok),
//       catchError((err) => {
//         // On error ensure not authenticated
//         this.authenticated = false;
//         localStorage.setItem(this.authKey, 'false');
//         return of(false);
//       })
//     );
//   }
//
//   isAuthenticated(): boolean {
//     return this.authenticated;
//   }
//
//   getToken(): string | null {
//     return localStorage.getItem(this.tokenKey);
//   }
//
//   logout(): void {
//     this.authenticated = false;
//     localStorage.removeItem(this.authKey);
//     localStorage.removeItem(this.tokenKey);
//   }
// }
