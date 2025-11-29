import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Calendar } from './components/calendar/calendar';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'calendar', component: Calendar, canActivate: [authGuard] },
];
