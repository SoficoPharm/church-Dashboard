export interface Member {
  id: number;
  membershipNumber: string;
  fullName: string;
  email: string | null;
  phone1: string | null;
  phone2: string | null;
  familyCode: string | null;
  memberCode: string | null;
  relationship: string | null;
  dateOfBirth: string | null;
  jobOrAcademicYear: string | null;
  confessionFather: string | null;
  address: string | null;
  area: string | null;
  isAdmin: boolean;
  createdAt: string;
}

export interface MemberCreateDto {
  membershipNumber: string;
  fullName: string;
  email?: string;
  phone1?: string;
  password: string;
}

export interface MemberUpdateDto {
  fullName?: string;
  email?: string;
  phone1?: string;
  newPassword?: string;
}