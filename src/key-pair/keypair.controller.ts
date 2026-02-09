import { Controller, Get } from '@nestjs/common';
import { KeypairService } from './keypair.service';

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
