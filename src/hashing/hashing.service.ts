import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
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
}
