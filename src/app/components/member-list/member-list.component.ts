import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  members: Member[] = [];
  filteredMembers: Member[] = [];
  searchTerm: string = '';

  isLoggedIn = false;
  isAdmin = false; // ✅ متغير جديد لتتبع صلاحية المدير
  loginModel = { membershipNumber: '', password: '' };
  loginError = '';

  showForm = false;
  isEditMode = false;
  editId = 0;
  formModel: any = {
    membershipNumber: '',
    fullName: '',
    email: '',
    phone: '',
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
      console.log('👤 Logged in user:', user);
      console.log('🔑 Is Admin:', this.isAdmin);
      if (!this.isAdmin) {
        alert('⚠️ You are not an admin! Only admins can add/edit/delete members.');
      }
      this.loadMembers();
    }
  }

  loadMembers(): void {
    this.memberService.getAll().subscribe(data => {
      this.members = data;
      this.filteredMembers = data;
    });
  }

  filterMembers(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredMembers = this.members;
      return;
    }
    this.filteredMembers = this.members.filter(m =>
      m.fullName.toLowerCase().includes(term) ||
      m.membershipNumber.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term)
    );
  }

  login(): void {
    this.authService.login(this.loginModel).subscribe({
      next: () => {
        this.isLoggedIn = true;
        this.loginError = '';
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.isAdmin = user.isAdmin || false;
        if (!this.isAdmin) {
          alert('⚠️ You are not an admin! Only admins can manage members.');
        }
        this.loadMembers();
      },
      error: () => this.loginError = 'Invalid credentials'
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

  openAddForm(): void {
    if (!this.isAdmin) {
      alert('⚠️ Only admins can add members.');
      return;
    }
    this.isEditMode = false;
    this.editId = 0;
    this.formModel = { membershipNumber: '', fullName: '', email: '', phone: '', password: '', newPassword: '' };
    this.showForm = true;
    this.formError = '';
  }

  openEditForm(member: Member): void {
    if (!this.isAdmin) {
      alert('⚠️ Only admins can edit members.');
      return;
    }
    this.isEditMode = true;
    this.editId = member.id;
    this.formModel = {
      membershipNumber: member.membershipNumber,
      fullName: member.fullName,
      email: member.email,
      phone: member.phone || '',
      password: '',
      newPassword: ''
    };
    this.showForm = true;
    this.formError = '';
  }

  saveMember(): void {
    if (!this.isAdmin) {
      this.formError = '⚠️ Only admins can perform this action.';
      return;
    }

    if (this.isEditMode) {
      const updateData: MemberUpdateDto = {
        fullName: this.formModel.fullName,
        email: this.formModel.email,
        phone: this.formModel.phone,
        newPassword: this.formModel.newPassword || undefined
      };
      this.memberService.update(this.editId, updateData).subscribe({
        next: () => {
          this.loadMembers();
          this.showForm = false;
        },
        error: (err) => {
          console.error('❌ Update failed:', err);
          this.formError = this.extractErrorMessage(err);
        }
      });
    } else {
      const createData: MemberCreateDto = {
        membershipNumber: this.formModel.membershipNumber,
        fullName: this.formModel.fullName,
        email: this.formModel.email,
        phone: this.formModel.phone,
        password: this.formModel.password
      };
      console.log('📤 Sending create data:', createData);
      this.memberService.create(createData).subscribe({
        next: () => {
          this.loadMembers();
          this.showForm = false;
        },
        error: (err) => {
          console.error('❌ Add failed:', err);
          this.formError = this.extractErrorMessage(err);
        }
      });
    }
  }

  private extractErrorMessage(err: any): string {
    if (err.error) {
      if (typeof err.error === 'string') {
        return err.error;
      }
      if (err.error.message) {
        return err.error.message;
      }
      if (err.error.errors) {
        const errors = err.error.errors;
        const messages = Object.values(errors).flat();
        return messages.join('; ');
      }
    }
    if (err.message) {
      return err.message;
    }
    return 'Unknown error occurred';
  }

  deleteMember(id: number): void {
    if (!this.isAdmin) {
      alert('⚠️ Only admins can delete members.');
      return;
    }
    if (confirm('Are you sure you want to delete this member?')) {
      this.memberService.delete(id).subscribe({
        next: () => this.loadMembers(),
        error: (err) => {
          console.error('❌ Delete failed:', err);
          alert('Delete failed: ' + this.extractErrorMessage(err));
        }
      });
    }
  }
}