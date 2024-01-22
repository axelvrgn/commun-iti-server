import { User } from "./User";

export interface BearerToken {
  token: string;
  expiresAt: number;
}

export interface AuthenticationResponse {
  user: User;
  bearer: BearerToken;
}

export interface AuthenticationCredentials {
  userId: string;
  passwordHash: string;
}
