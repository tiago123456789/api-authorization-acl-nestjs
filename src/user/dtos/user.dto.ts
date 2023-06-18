import { IsNotEmpty, IsNumber, isNotEmpty } from 'class-validator';
import { Role } from 'src/common/types/role';

export class UserDto {
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNumber()
  roleId: number;
}
