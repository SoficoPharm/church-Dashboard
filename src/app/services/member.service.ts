import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Member, MemberCreateDto, MemberUpdateDto } from '../models/member.model';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(search?: string): Observable<Member[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<Member[]>(`${this.apiUrl}/Members`, { params });
  }

  getById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/Members/${id}`);
  }

  getByFamilyCode(familyCode: string): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/Members`, {
      params: new HttpParams().set('familyCode', familyCode)
    });
  }

  getMe(): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/Members/me`);
  }

  create(data: MemberCreateDto): Observable<Member> {
    return this.http.post<Member>(`${this.apiUrl}/Members`, data);
  }

  update(id: number, data: MemberUpdateDto): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/Members/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Members/${id}`);
  }
}