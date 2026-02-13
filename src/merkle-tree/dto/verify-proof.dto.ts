import { IsString, IsNotEmpty, IsOptional, IsArray, IsHexadecimal } from 'class-validator';

export class VerifyProofDTO {
  @IsString()
  @IsNotEmpty()
  leaf: string;

  @IsArray()
  @IsNotEmpty()
  proof: { hash: string; position: 'left' | 'right' }[];

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  root: string;

  @IsOptional()
  @IsString()
  algorithm?: string;
}
