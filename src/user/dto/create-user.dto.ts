import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsString,
  isStrongPassword,
  IsStrongPassword, Matches,
  Max,
  MaxLength,
  MinLength
} from "class-validator";
import { Match } from "../decorator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(8)
  name: string;

  @IsNotEmpty()
  @MaxLength(255)
  @IsStrongPassword({
    minUppercase: 1,
    minSymbols: 0,
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1
  })
  password: string;

  // da fare

  @Match('password')
  passwordConfirm: string;
}
