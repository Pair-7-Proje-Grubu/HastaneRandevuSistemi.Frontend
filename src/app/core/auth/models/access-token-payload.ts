export interface AccessTokenPayload {
  id: string;
  email: string;
  roles: string[];
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
}
