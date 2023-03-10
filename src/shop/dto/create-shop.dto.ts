import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateShopDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  @IsString()
  @IsOptional()
  address?: string;
  @IsString()
  @IsOptional()
  googleMaps?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
