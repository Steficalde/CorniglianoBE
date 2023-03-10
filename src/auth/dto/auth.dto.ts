import {
  IsEmail,
  IsNotEmpty,
  IsString, MaxLength
} from "class-validator";

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
