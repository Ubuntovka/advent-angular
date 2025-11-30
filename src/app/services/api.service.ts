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
  private apiUrl = 'https://katsala.com/advent/api/';

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


  getDays(): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.getToken()}`
    };
    return this.http.get(this.apiUrl + "/api/days/today", {headers});
  }

}
