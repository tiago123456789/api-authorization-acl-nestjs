export interface EncrypterInterface {
  getHash(plainText): Promise<string>;
  isValid(hash, plainText): Promise<boolean>;
}
