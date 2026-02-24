import { Injectable } from '@nestjs/common';
import { createHash, createHmac, randomBytes } from 'crypto';
import { HashDTO } from './dto';

@Injectable()
export class HashingService {
  hash(dto: HashDTO) {
    return createHash('sha256').update(dto.input).digest('base64');
  }

  compare() {
    const password = 'hi-mom!';
    const hash1 = this.hash({ input: password });
    const hash2 = this.hash({ input: password });
    const match = hash1 === hash2;
    return match;
  }

  hmac() {
    const key = randomBytes(32).toString('hex');
    const message = 'boo 👻';

    const hmac = createHmac('sha256', key).update(message).digest('hex');

    const key2 = randomBytes(32).toString('hex');
    const hmac2 = createHmac('sha256', key2).update(message).digest('hex');

    return { hmac1: hmac, hmac2 };
  }
}
