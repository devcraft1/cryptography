import { IsString, IsNotEmpty, IsHexadecimal, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EnvelopeDataDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MinLength(2)
  @MaxLength(10000)
  encryptedData: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MinLength(2)
  @MaxLength(10000)
  dataIv: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MinLength(2)
  @MaxLength(10000)
  dataAuthTag: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MinLength(2)
  @MaxLength(10000)
  encryptedDek: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MinLength(2)
  @MaxLength(10000)
  dekIv: string;

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MinLength(2)
  @MaxLength(10000)
  dekAuthTag: string;
}

export class EnvelopeDecryptDTO {
  @ValidateNested()
  @Type(() => EnvelopeDataDTO)
  @IsNotEmpty()
  envelope: EnvelopeDataDTO;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  masterKey: string;
}
