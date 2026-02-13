import { IsString, IsNotEmpty, IsObject, IsHexadecimal } from 'class-validator';

export class EnvelopeDecryptDTO {
  @IsObject()
  @IsNotEmpty()
  envelope: {
    encryptedData: string;
    dataIv: string;
    dataAuthTag: string;
    encryptedDek: string;
    dekIv: string;
    dekAuthTag: string;
  };

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  masterKey: string;
}
