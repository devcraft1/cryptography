import { IsArray, IsNotEmpty, IsOptional, IsString, ArrayMinSize, ArrayMaxSize, MaxLength, IsIn } from 'class-validator';

export class BuildTreeDTO {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10000)
  @IsString({ each: true })
  @MaxLength(10000, { each: true })
  leaves: string[];

  @IsOptional()
  @IsIn(['sha256', 'sha512', 'sha384'])
  algorithm?: string;
}
