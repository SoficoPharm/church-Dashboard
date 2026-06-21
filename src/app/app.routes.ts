import { Routes } from '@angular/router';
import { MemberListComponent } from './components/member-list/member-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'members', pathMatch: 'full' },
  { path: 'members', component: MemberListComponent },
  { path: 'login', component: MemberListComponent } // هنخلي صفحة login بنفس الكمبوننت
  // لكننا هنضيف منطق تسجيل الدخول في نفس المكون عشان نبسط
];