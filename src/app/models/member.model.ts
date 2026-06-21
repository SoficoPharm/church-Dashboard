export interface Member {
  id: number;
  membershipNumber: string;
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: string;
  isAdmin: boolean;
}

export interface MemberCreateDto {
  membershipNumber: string;
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface MemberUpdateDto {
  fullName?: string;
  email?: string;
  phone?: string;
  newPassword?: string;
}