import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommitmentDTO {
  @IsString()
  @IsNotEmpty()
  secret: string;
}
