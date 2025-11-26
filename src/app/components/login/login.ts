import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {LoginService} from '../../services/login';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  readonly password = new FormControl('');

  loginForm = new FormGroup({
    password: this.password,
    // password: new FormControl()
  });


  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(protected loginService: LoginService, private router: Router) {
  }


  login() {
    if (this.loginForm.valid) {
      const ok = this.loginService.loginUser(this.password.value);
      if (ok) {
        this.router.navigate(['calendar']); // or your desired route
        console.log("yes");
      } else {
        console.log('Invalid password');
      }
    }
  }
}
