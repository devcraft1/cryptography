import { IsArray, IsNotEmpty, IsOptional, ArrayMaxSize, IsIn } from 'class-validator';

export class BuildTreeDTO {
  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(10000)
  leaves: string[];

  @IsOptional()
  @IsIn(['sha256', 'sha512', 'sha384'])
  algorithm?: string;
}
