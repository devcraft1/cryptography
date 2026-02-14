import { IsString, IsNotEmpty, IsOptional, IsArray, IsHexadecimal, MaxLength, ArrayMaxSize, IsIn } from 'class-validator';

export class VerifyProofDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  leaf: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(10000)
  proof: { hash: string; position: 'left' | 'right' }[];

  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @MaxLength(10000)
  root: string;

  @IsOptional()
  @IsIn(['sha256', 'sha512', 'sha384', 'sha1', 'md5'])
  algorithm?: string;
}
