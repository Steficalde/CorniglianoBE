import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateAwardDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  description: string;
  @IsNumber()
  quantity: number;
}
