import { IsArray, IsNotEmpty, IsOptional, IsNumber, IsString, ArrayMaxSize, Min, Max, IsIn } from 'class-validator';

export class GetProofDTO {
  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(10000)
  @IsString({ each: true })
  leaves: string[];

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(9999)
  leafIndex: number;

  @IsOptional()
  @IsIn(['sha256', 'sha512', 'sha384'])
  algorithm?: string;
}
