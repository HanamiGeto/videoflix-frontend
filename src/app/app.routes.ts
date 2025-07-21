import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { BrowseComponent } from './browse/browse.component';
import { DataprotectionComponent } from './dataprotection/dataprotection.component';
import { ImprintComponent } from './imprint/imprint.component';
import { authGuard } from './shared/auth.guard';
import { WatchComponent } from './watch/watch.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MyListComponent } from './my-list/my-list.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/landing-page', pathMatch: 'full' },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: PasswordResetComponent },
  { path: 'browse', component: BrowseComponent, canActivate: [authGuard] },
  { path: 'my-list', component: MyListComponent, canActivate: [authGuard] },
  {
    path: 'watch/:id',
    component: WatchComponent,
    canActivate: [authGuard],
    data: { animation: 'routeTransition' },
  },
  { path: 'data-protection', component: DataprotectionComponent },
  { path: 'imprint', component: ImprintComponent },
];
