import { IsInt, IsOptional, IsString } from 'class-validator';

export class ProsConsDiscusserStreamDto {
  @IsString()
  readonly prompt: string;

  @IsInt()
  @IsOptional()
  readonly maxTokens?: number;
}
