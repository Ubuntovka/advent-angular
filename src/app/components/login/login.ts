import {Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {Router, RouterLink} from '@angular/router';
import {MatFormField, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton, MatButtonModule} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormField,
    MatInputModule,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatButton,
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);

  loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  errorMessage = signal('');

  constructor(protected apiService: ApiService, private router: Router) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  ngOnInit() {
  }

  login() {
    if (this.loginForm.valid) {
      const emailValue = this.email.value;
      const passwordValue = this.password.value;
      this.apiService.loginUser(emailValue, passwordValue)
        .subscribe({
          next: (response) => {
            this.router.navigate(['/calendar']);
            this.successfulSnackBar();
          },
          error: (err) => {
            this.errorSnackBar();
          },
        });
    }
  }

  logout() {
    this.apiService.logout();
  }

  // email
  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  // password
  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  // Snackbars
  private _snackBar = inject(MatSnackBar);

  successfulSnackBar() {
    this._snackBar.open("You’ve signed in successfully!", "Hide", {
      duration: 3000
    });
  }

  errorSnackBar() {
    this._snackBar.open("Sign-in error. Check your credentials.", "Hide", {
      duration: 3000
    });
  }

}


// import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
// import {MatButtonModule} from '@angular/material/button';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatIconModule} from '@angular/material/icon';
// import {MatInputModule} from '@angular/material/input';
// import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
// import {Router} from '@angular/router';
// import {LoginService} from '../../services/login';
//
// @Component({
//   selector: 'app-login',
//   imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
//   templateUrl: './login.html',
//   styleUrl: './login.css',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class Login {
//   readonly email = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] });
//   readonly password = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] });
//
//   loginForm = new FormGroup({
//     email: this.email,
//     password: this.password,
//   });
//
//   submitting = signal(false);
//   errorMsg = signal<string | null>(null);
//
//   hide = signal(true);
//   clickEvent(event: MouseEvent) {
//     this.hide.set(!this.hide());
//     event.stopPropagation();
//   }
//
//   constructor(protected loginService: LoginService, private router: Router) {}
//
//   login() {
//     this.errorMsg.set(null);
//     if (this.loginForm.invalid) {
//       this.loginForm.markAllAsTouched();
//       return;
//     }
//     this.submitting.set(true);
//     this.loginService.loginUser(this.email.value, this.password.value).subscribe({
//       next: (ok) => {
//         this.submitting.set(false);
//         if (ok) {
//           this.router.navigate(['calendar']);
//         } else {
//           this.errorMsg.set('Invalid email or password');
//         }
//       },
//       error: () => {
//         this.submitting.set(false);
//         this.errorMsg.set('Login failed. Please try again.');
//       }
//     });
//   }
// }
