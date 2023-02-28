import {IsNotEmpty, IsString} from 'class-validator';

export class CreateShopDto {
  @IsNotEmpty()
  isActive: boolean;
  @IsString()
  address: string;
  @IsString()
  googleMaps: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  description: string;
}
