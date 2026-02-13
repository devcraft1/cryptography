import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BuildTreeDTO {
  @IsArray()
  @IsNotEmpty()
  leaves: string[];

  @IsOptional()
  @IsString()
  algorithm?: string;
}
