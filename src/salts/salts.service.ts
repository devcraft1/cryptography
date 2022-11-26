import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

@Injectable()
export class SaltsService {
  users = [];

  signup(email: string, password: string) {
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = scryptSync(password, salt, 64).toString('hex');

    const user = { email, password: `${salt}:${hashedPassword}` };

    this.users.push(user);

    return user;
  }

  signin(email: string, password: string) {
    const user = this.users.find((v) => v.email === email);
    if (!user) return 'credentials not found';

    const [salt, key] = user.password.split(':');

    const hashedBuffer = scryptSync(password, salt, 64);

    const keyBuffer = Buffer.from(key, 'hex');

    const match = timingSafeEqual(hashedBuffer, keyBuffer);
    if (match) {
      return 'login success!';
    } else {
      return 'login fail!';
    }
  }
}
