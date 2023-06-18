import { IsNotEmpty } from 'class-validator';

export class CredentialAuthDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
