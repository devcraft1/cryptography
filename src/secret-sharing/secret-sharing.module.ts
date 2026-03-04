import { Module } from '@nestjs/common';
import { SecretSharingService } from './secret-sharing.service';
import { SecretSharingController } from './secret-sharing.controller';

@Module({
  providers: [SecretSharingService],
  controllers: [SecretSharingController],
  exports: [SecretSharingService],
})
export class SecretSharingModule {}
