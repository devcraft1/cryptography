import { Body, Controller, Get, Post } from '@nestjs/common';
import { SaltsService } from 'src/salts/salts.service';
import { SaltDTO } from 'src/salts/dto';
import { KeypairService } from 'src/keypair/keypair.service';
import { EncryptionService } from 'src/encryption/encryption.service';
@Controller('app')
export class AppController {
  constructor(
    private salts: SaltsService,
    private keypair: KeypairService,
    private encrypt: EncryptionService,
  ) {}
  // keypairs
  @Get('keypairs')
  getAllKeys() {
    return this.keypair.keyPairs();
  }
  @Get('keypairs/privatekeys')
  getPrivateKey() {
    return this.keypair.privateKey();
  }
  @Get('keypairs/publickeys')
  getPublicKey() {
    return this.keypair.publicKey();
  }

  @Get('keypairs/signin')
  signInWithKeys() {
    return this.keypair.signin();
  }

  // encrypt
  @Get('encryption/asymmetric')
  asymmetricEncryption() {
    return this.encrypt.asymmetric();
  }

  @Get('encryption/symmetric')
  symmetricEncryption() {
    return this.encrypt.symmetric();
  }

  // salts
  @Post('salts/signup')
  signUpwithSalt(@Body() dto: SaltDTO) {
    return this.salts.signup(dto.email, dto.password);
  }
  @Post('salts/signin')
  signInwithSalt(@Body() dto: SaltDTO) {
    return this.salts.signin(dto.email, dto.password);
  }
}
