import { IsString, IsNotEmpty, IsOptional, IsHexadecimal, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EnvelopeDataDTO } from './decrypt.dto';

export class RotateKeyDTO {
  @ValidateNested()
  @Type(() => EnvelopeDataDTO)
  @IsNotEmpty()
  envelope: EnvelopeDataDTO;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  oldMasterKey: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  newMasterKey?: string;
}
