import { IsNotEmpty, Length } from 'class-validator';

export class PermissionDto {
  id: number;

  @IsNotEmpty()
  @Length(1, 150)
  name: string;
}
