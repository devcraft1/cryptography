import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KeypairService } from './keypair.service';

@ApiTags('Key Pairs')
@Controller('keypairs')
export class KeypairController {
  constructor(private keypair: KeypairService) {}

  @Get()
  getAllKeys() {
    return this.keypair.keyPairs();
  }

  @Get('privatekeys')
  getPrivateKey() {
    return this.keypair.privateKey();
  }

  @Get('publickeys')
  getPublicKey() {
    return this.keypair.publicKey();
  }

  @Get('signin')
  signInWithKeys() {
    return this.keypair.signin();
  }
}
