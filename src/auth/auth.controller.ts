import {
  Body,
  Controller, HttpCode, HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { CreateUserDto } from "../user/dto/create-user.dto";
import { Tokens } from "./types";

@Controller('auth')
export class AuthController {
  // NEST know hot to take the AuthService and init
  // private equal to declare out of the const and after this.x = x
  constructor(private authService: AuthService) {}

  @Post("signup")
  signup(@Body() createUserDto: CreateUserDto): Promise<Tokens> {
    // nextjs know daatype
    return this.authService.signup(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() authDto: AuthDto) {
    return this.authService.signin(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshTokens() {
    return this.authService.refreshTokens();
  }
}
