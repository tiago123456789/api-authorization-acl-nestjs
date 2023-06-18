import { JwtService } from '@nestjs/jwt';
import { AuthTokenInterface, TokenPayload } from './auth-token.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthToken implements AuthTokenInterface {
  constructor(private jwtService: JwtService) {}

  get(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async isValid(token: string): Promise<boolean | TokenPayload> {
    try {
      const payload: TokenPayload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      return false;
    }
  }
}
