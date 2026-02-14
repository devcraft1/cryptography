import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CommitDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  value: string;
}
