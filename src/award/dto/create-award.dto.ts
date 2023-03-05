import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAwardDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsOptional()
  quantity?: number;
}
