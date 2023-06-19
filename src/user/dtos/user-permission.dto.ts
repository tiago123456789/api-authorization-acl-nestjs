import { IsNumber } from 'class-validator';

export class UserPermissionDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  permissionId: number;
}
