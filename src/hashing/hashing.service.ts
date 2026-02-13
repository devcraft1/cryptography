import { Injectable } from '@nestjs/common';
import { createHash, createHmac } from 'crypto';
import { HashDTO } from './dto';

@Injectable()
export class HashingService {
  // hash
  hash(dto: HashDTO) {
    return createHash('sha256').update(dto.input).digest('base64');
  }

  compare() {
    let password: any = 'hi-mom!';
    const hash1 = this.hash(password);

    /// ... some time later

    password = 'hi-mom!';
    const hash2 = this.hash(password);
    const match = hash1 === hash2;

  }

  // hmac
  hmac() {
    const key = 'super-secret!';
    const message = 'boo 👻';

    const hmac = createHmac('sha256', key).update(message).digest('hex');

    const key2 = 'other-password';
    const hmac2 = createHmac('sha256', key2).update(message).digest('hex');
  }
}
