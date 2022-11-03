import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { CatService } from './cats/cats.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CatsModule],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
