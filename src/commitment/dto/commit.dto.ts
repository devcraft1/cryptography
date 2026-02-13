import { IsString, IsNotEmpty } from 'class-validator';

export class CommitDTO {
  @IsString()
  @IsNotEmpty()
  value: string;
}
