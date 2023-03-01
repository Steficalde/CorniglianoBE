import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAwardUserDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @IsNumber()
  @IsNotEmpty()
  awardId: number;
}
