import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { BrowseComponent } from './browse/browse.component';
import { DataprotectionComponent } from './dataprotection/dataprotection.component';
import { ImprintComponent } from './imprint/imprint.component';
import { authGuard } from './shared/auth.guard';
import { VideoUploadComponent } from './video-upload/video-upload.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'browse', component: BrowseComponent, canActivate: [authGuard] },
  { path: 'upload', component: VideoUploadComponent, canActivate: [authGuard] },
  { path: 'data-protection', component: DataprotectionComponent },
  { path: 'imprint', component: ImprintComponent },
];
