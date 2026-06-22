import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Member, MemberCreateDto, MemberUpdateDto } from '../models/member.model';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/Members`);
  }

  getById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/Members/${id}`);
  }

  create(data: MemberCreateDto): Observable<Member> {
    console.log('📤 Creating member with data:', data);
    return this.http.post<Member>(`${this.apiUrl}/Members`, data);
  }

  update(id: number, data: MemberUpdateDto): Observable<void> {
    console.log('📤 Updating member with data:', data);
    return this.http.put<void>(`${this.apiUrl}/Members/${id}`, data);
  }

  delete(id: number): Observable<void> {
    console.log('🗑️ Deleting member with id:', id);
    return this.http.delete<void>(`${this.apiUrl}/Members/${id}`);
  }
}