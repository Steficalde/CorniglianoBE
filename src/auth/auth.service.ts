import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Tokens } from "./types";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private userService: UserService,
  ) {}
  async signup(createUserDto: CreateUserDto): Promise<Tokens> {
    const user = await this.userService.create(createUserDto);
    // @ts-ignore
    return this.signToken(user.id, user.email);
  }

  async signin(authDto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credential incorrect!');

    const pwMatches = await argon.verify(user.hash, authDto.password);

    if (!pwMatches) throw new ForbiddenException( 'Credential incorrect!');

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }

  logout() {

  }

  refreshTokens() {

  }
}
