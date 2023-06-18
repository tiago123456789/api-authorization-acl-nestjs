import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  AuthTokenInterface,
  TokenPayload,
} from 'src/common/adapters/auth-token.interface';
import provider from 'src/common/configs/provider';
import { RequestWithUserId } from 'src/common/types/request-with-userid';
import { Role } from 'src/common/types/role';

@Injectable()
export class SecurityGuard implements CanActivate {
  constructor(
    @Inject(provider.AUTH_TOKEN) private readonly authToken: AuthTokenInterface,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUserId = context.switchToHttp().getRequest();
    let accessToken = request.header('authorization');
    if (!accessToken) {
      return false;
    }

    accessToken = accessToken.replace('Bearer ', '');
    let payload: boolean | TokenPayload = await this.authToken.isValid(
      accessToken,
    );

    if (!payload) {
      return false;
    }

    const requiredRoles: string[] = this.reflector.getAllAndOverride<Role[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    payload = payload as TokenPayload;
    request.userId = payload.id;
    for (let index = 0; index < payload.permissions.length; index += 1) {
      const permission: string = payload.permissions[index];
      if (requiredRoles.indexOf(permission) >= 0) {
        return true;
      }
    }

    return false;
  }
}
