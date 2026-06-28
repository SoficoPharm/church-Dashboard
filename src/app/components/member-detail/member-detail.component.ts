import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from '../../services/member.service';
import { Member } from '../../models/member.model';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private memberService = inject(MemberService);

  selectedMember: Member | null = null;
  familyMembers: Member[] = [];
  loading = true;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadMemberAndFamily(id);
    });
  }

  loadMemberAndFamily(id: number): void {
    this.loading = true;
    this.selectedMember = null;
    this.familyMembers = [];

    this.memberService.getById(id).pipe(
      tap(member => this.selectedMember = member),
      switchMap(member => {
        if (member.familyCode) {
          return this.memberService.getByFamilyCode(member.familyCode);
        }
        return of([member]);
      })
    ).subscribe({
      next: (members) => {
        this.familyMembers = members;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  selectMember(member: Member): void {
    this.router.navigate(['/members', member.id]);
  }

  goBack(): void {
    this.router.navigate(['/members']);
  }

  isSelected(member: Member): boolean {
    return this.selectedMember?.id === member.id;
  }
}