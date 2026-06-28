import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MemberService } from '../../services/member.service';
import { AuthService } from '../../services/auth.service';
import { Member, MemberCreateDto, MemberUpdateDto } from '../../models/member.model';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  private memberService = inject(MemberService);
  private authService = inject(AuthService);
  private router = inject(Router);

  members: Member[] = [];
  filteredMembers: Member[] = [];
  searchTerm: string = '';

  isLoggedIn = false;
  isAdmin = false;
  loginModel = { membershipNumber: '', password: '' };
  loginError = '';

  showForm = false;
  isEditMode = false;
  editId = 0;
  formModel: any = {
    membershipNumber: '',
    fullName: '',
    email: '',
    phone1: '',
    password: '',
    newPassword: ''
  };
  formError = '';

  ngOnInit(): void {
    this.checkLogin();
  }

  checkLogin(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.isAdmin = user.isAdmin || false;
      this.loadMembers();
    }
  }

  loadMembers(): void {
    this.memberService.getAll().subscribe({
      next: (data) => {
        this.members = data;
        this.filteredMembers = data;
      },
      error: (err) => console.error('Failed to load members:', err)
    });
  }

  filterMembers(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredMembers = this.members;
      return;
    }
    this.filteredMembers = this.members.filter(m =>
      m.fullName?.toLowerCase().includes(term) ||
      m.membershipNumber?.toLowerCase().includes(term) ||
      m.email?.toLowerCase().includes(term) ||
      m.phone1?.toLowerCase().includes(term)
    );
  }

login(): void {
  this.authService.login(this.loginModel).subscribe({
    next: (res) => {
      console.log('✅ Login Success:', res);

      this.isLoggedIn = true;
      this.loginError = '';

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.isAdmin = user.isAdmin || false;

      console.log('Stored User:', user);
      console.log('Stored Token:', localStorage.getItem('token'));

      this.loadMembers();
    },

    error: (err) => {
      console.error('❌ Login Error');
      console.error('Status:', err.status);
      console.error('Error:', err.error);
      console.error(err);

      this.loginError = err.error?.message || 'Login failed';
    }
  });
}
  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.members = [];
    this.filteredMembers = [];
    this.searchTerm = '';
  }

  viewMember(member: Member): void {
    this.router.navigate(['/members', member.id]);
  }

  openAddForm(): void {
    if (!this.isAdmin) { alert('⚠️ Only admins can add members.'); return; }
    this.isEditMode = false;
    this.editId = 0;
    this.formModel = { membershipNumber: '', fullName: '', email: '', phone1: '', password: '', newPassword: '' };
    this.showForm = true;
    this.formError = '';
  }

  openEditForm(member: Member, event: Event): void {
    event.stopPropagation(); // منع الـ click من يوصل للـ row
    if (!this.isAdmin) { alert('⚠️ Only admins can edit members.'); return; }
    this.isEditMode = true;
    this.editId = member.id;
    this.formModel = {
      membershipNumber: member.membershipNumber,
      fullName: member.fullName,
      email: member.email || '',
      phone1: member.phone1 || '',
      password: '',
      newPassword: ''
    };
    this.showForm = true;
    this.formError = '';
  }

  saveMember(): void {
    if (!this.isAdmin) { this.formError = '⚠️ Only admins can perform this action.'; return; }

    if (this.isEditMode) {
      const updateData: MemberUpdateDto = {
        fullName: this.formModel.fullName,
        email: this.formModel.email,
        newPassword: this.formModel.newPassword || undefined
      };
      this.memberService.update(this.editId, updateData).subscribe({
        next: () => { this.loadMembers(); this.showForm = false; },
        error: (err) => { this.formError = this.extractErrorMessage(err); }
      });
    } else {
      const createData: MemberCreateDto = {
        membershipNumber: this.formModel.membershipNumber,
        fullName: this.formModel.fullName,
        email: this.formModel.email,
        password: this.formModel.password
      };
      this.memberService.create(createData).subscribe({
        next: () => { this.loadMembers(); this.showForm = false; },
        error: (err) => { this.formError = this.extractErrorMessage(err); }
      });
    }
  }

  deleteMember(id: number, event: Event): void {
    event.stopPropagation(); // منع الـ click من يوصل للـ row
    if (!this.isAdmin) { alert('⚠️ Only admins can delete members.'); return; }
    if (confirm('Are you sure you want to delete this member?')) {
      this.memberService.delete(id).subscribe({
        next: () => this.loadMembers(),
        error: (err) => alert('Delete failed: ' + this.extractErrorMessage(err))
      });
    }
  }

  private extractErrorMessage(err: any): string {
    if (err.error?.message) return err.error.message;
    if (typeof err.error === 'string') return err.error;
    return 'Unknown error occurred';
  }
}