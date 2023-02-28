import {IsNotEmpty, IsNumber} from "class-validator";

export class CreatePurchaseDto{
  @IsNumber()
  @IsNotEmpty()
  points: number;

  @IsNumber()
  @IsNotEmpty()
  shopId: number

  @IsNumber()
  @IsNotEmpty()
  userId: number
}
