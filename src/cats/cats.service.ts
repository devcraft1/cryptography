import { Injectable } from '@nestjs/common';

@Injectable()
export class CatService {
  getCat(): number {
    return 1234;
  }
}
