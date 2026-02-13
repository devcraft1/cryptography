import { IsNotEmpty } from 'class-validator';

export class HashDTO {
  @IsNotEmpty()
  input: any;
}
