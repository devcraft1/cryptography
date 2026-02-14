import { IsOptional, IsIn } from 'class-validator';

export class EcdhDTO {
  @IsOptional()
  @IsIn(['secp256k1', 'prime256v1', 'secp384r1', 'secp521r1'])
  curve?: string;
}
