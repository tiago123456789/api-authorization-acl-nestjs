import * as bcrypt from 'bcryptjs';
import { EncrypterInterface } from './encrypter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptEncrypter implements EncrypterInterface {
  getHash(plainText: any): Promise<string> {
    return bcrypt.hash(plainText, 8);
  }

  isValid(hash: any, plainText: any): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
