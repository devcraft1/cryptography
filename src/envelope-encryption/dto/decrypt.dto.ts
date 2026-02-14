import { IsString, IsNotEmpty, IsObject, IsHexadecimal, MaxLength } from 'class-validator';

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
  @MaxLength(10000)
  masterKey: string;
}
