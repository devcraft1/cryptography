import { Body, Controller, Get, Post } from '@nestjs/common';
import { SaltsService } from './salts/salts.service';
import { SaltDTO } from './salts/dto';
import { KeypairService } from './key-pair/keypair.service';
import { EncryptionService } from './encryption/encryption.service';
import { HashingService } from './hashing/hashing.service';
import { HashDTO } from './hashing/dto';
import { HmacService } from './hmac/hmac.service';
import { HmacDTO } from './hmac/dto';
import { DigitalSignaturesService } from './digital-signatures/digital-signatures.service';
import { SignMessageDTO } from './digital-signatures/dto';
import { KeyDerivationService } from './key-derivation/key-derivation.service';
import { KdfDTO } from './key-derivation/dto';
@Controller()
export class AppController {
  constructor(
    private salts: SaltsService,
    private keypair: KeypairService,
    private encrypt: EncryptionService,
    private hashing: HashingService,
    private hmac: HmacService,
    private digitalSignatures: DigitalSignaturesService,
    private keyDerivation: KeyDerivationService,
  ) {}

  // Hashing

  @Post('hash/create')
  createHash(dto: HashDTO) {
    return this.hashing.hash(dto.input);
  }

  @Post('hash/compare')
  compareHash() {
    return this.hashing.compare();
  }

  @Post('hash/createhmac')
  createhmac() {
    return this.hashing.hmac();
  }

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
  getAsymmetricEncryption() {
    return this.encrypt.asymmetric();
  }

  @Get('encryption/symmetric')
  getSymmetricEncryption() {
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

  // HMAC
  @Post('hmac/generate')
  generateHmac(@Body() dto: HmacDTO) {
    return {
      hmac: this.hmac.generateHmac(dto.message, dto.key),
      message: dto.message,
    };
  }

  @Post('hmac/verify')
  verifyHmac(
    @Body() dto: { message: string; key: string; expectedHmac: string },
  ) {
    return {
      isValid: this.hmac.verifyHmac(dto.message, dto.key, dto.expectedHmac),
      message: dto.message,
    };
  }

  @Get('hmac/demo')
  demonstrateHmac() {
    return this.hmac.demonstrateHmac();
  }

  // Digital Signatures
  @Post('signatures/sign')
  signMessage(@Body() dto: SignMessageDTO) {
    return {
      signature: this.digitalSignatures.signMessage(dto.message),
      message: dto.message,
    };
  }

  @Post('signatures/verify')
  verifySignature(
    @Body() dto: { message: string; signature: string; publicKey?: string },
  ) {
    return {
      isValid: this.digitalSignatures.verifySignature(
        dto.message,
        dto.signature,
        dto.publicKey,
      ),
      message: dto.message,
    };
  }

  @Get('signatures/demo')
  demonstrateDigitalSignature() {
    return this.digitalSignatures.demonstrateDigitalSignature();
  }

  @Get('signatures/keypair')
  generateSignatureKeyPair() {
    return this.digitalSignatures.generateKeyPair();
  }

  // Key Derivation
  @Post('kdf/pbkdf2')
  derivePbkdf2(@Body() dto: KdfDTO) {
    return this.keyDerivation.pbkdf2(
      dto.password,
      dto.salt,
      dto.iterations,
      dto.keyLength,
    );
  }

  @Post('kdf/scrypt')
  deriveScrypt(@Body() dto: KdfDTO) {
    return this.keyDerivation.scrypt(dto.password, dto.salt, dto.keyLength);
  }

  @Get('kdf/demo')
  demonstrateKdf() {
    return this.keyDerivation.demonstrateKdf();
  }

  @Post('kdf/verify')
  verifyDerivedKey(
    @Body()
    dto: {
      password: string;
      salt: string;
      storedKey: string;
      method: 'pbkdf2' | 'scrypt';
      options?: any;
    },
  ) {
    return {
      isValid: this.keyDerivation.verifyPassword(
        dto.password,
        dto.salt,
        dto.storedKey,
        dto.method,
        dto.options,
      ),
    };
  }
}
