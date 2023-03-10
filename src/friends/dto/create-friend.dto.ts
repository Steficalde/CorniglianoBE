import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateFriendDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @IsNumber()
  @IsNotEmpty()
  friendId: number;
}
