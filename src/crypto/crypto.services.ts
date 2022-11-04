import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoService {
  getCrypto(): number {
    return 1234578;
  }
}
