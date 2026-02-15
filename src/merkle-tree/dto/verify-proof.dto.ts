import { IsString, IsNotEmpty, IsOptional, IsArray, IsHexadecimal, MaxLength, MinLength, ArrayMaxSize, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProofElementDTO {
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MinLength(2)
  @MaxLength(10000)
  hash: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['left', 'right'])
  position: 'left' | 'right';
}

export class VerifyProofDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  leaf: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(10000)
  @ValidateNested({ each: true })
  @Type(() => ProofElementDTO)
  proof: ProofElementDTO[];

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsHexadecimal()
  @MaxLength(10000)
  root: string;

  @IsOptional()
  @IsIn(['sha256', 'sha512', 'sha384'])
  algorithm?: string;
}
