import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryPaginationDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Transform(({ value }: { value: string }) => parseInt(value))
  limit: number = 5;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Transform(({ value }: { value: string }) => parseInt(value))
  page: number = 1;
}
