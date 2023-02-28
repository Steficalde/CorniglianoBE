import {
  Body,
  Controller, HttpCode, HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  // NEST know hot to take the AuthService and init
  // private equal to declare out of the const and after this.x = x
  constructor(private authService: AuthService) {}

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    // nextjs know daatype
    return this.authService.signup(dto);
  }
}
