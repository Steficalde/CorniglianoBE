
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateAwardUserDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
  @IsNotEmpty()
  @IsNumber()
  awardId: number;
}
