import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class SubmitChallengeDto {
  @ApiProperty({ description: 'User answer — structure depends on challenge type' })
  @IsObject()
  answer: Record<string, any>;
}
