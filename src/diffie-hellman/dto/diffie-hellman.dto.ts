import { IsString, IsOptional } from 'class-validator';

export class EcdhDTO {
  @IsOptional()
  @IsString()
  curve?: string;
}
