import { Routes } from '@angular/router';
import { MemberListComponent } from './components/member-list/member-list.component';
import { MemberDetailComponent } from './components/member-detail/member-detail.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'members', pathMatch: 'full' },
  { path: 'members', component: MemberListComponent, canActivate: [authGuard] },
  { path: 'members/:id', component: MemberDetailComponent, canActivate: [authGuard] },
  { path: 'login', component: MemberListComponent },
  { path: '**', redirectTo: 'members' }
];