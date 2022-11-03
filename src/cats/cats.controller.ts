import { CatService } from './cats.service';
import { Get, Controller } from '@nestjs/common';

@Controller('service')
export class CatsController {
  constructor(private readonly catService: CatService) {}

  @Get()
  async catNumber(): Promise<number> {
    const x = await this.catService.getCat();
    return x;
  }
}
