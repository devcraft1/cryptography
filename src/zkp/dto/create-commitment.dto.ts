import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommitmentDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  secret: string;
}
