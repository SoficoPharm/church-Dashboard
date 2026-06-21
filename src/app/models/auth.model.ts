export interface LoginDto {
  membershipNumber: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  membershipNumber: string;
  fullName: string;
  isAdmin: boolean;
  expiresAt: string;
}