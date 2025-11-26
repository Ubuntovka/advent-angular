import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  loginUser(password: string | null): Boolean {
    return password === "pooksieKonradzmij";
  }

}
