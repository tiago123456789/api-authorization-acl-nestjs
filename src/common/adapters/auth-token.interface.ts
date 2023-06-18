export interface TokenPayload {
  id: number;
  email: string;
  role: string;
  permissions: string[];
}

export interface AuthTokenInterface {
  get(payload: TokenPayload): Promise<string>;
  isValid(token: string): Promise<boolean | TokenPayload>;
}
