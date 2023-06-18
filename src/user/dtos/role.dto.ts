import { IsNotEmpty, Length } from 'class-validator';

export class RoleDto {
  id: number;

  @IsNotEmpty()
  @Length(1, 100)
  name: string;
}
