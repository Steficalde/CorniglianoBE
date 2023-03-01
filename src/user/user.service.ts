import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';
import {User} from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const hash = await argon.hash(createUserDto.password);
    let user: User;
    try {
      user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          hash,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Credentials taken');
      }
      throw error;
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email: updateUserDto.email,
        hash:
          updateUserDto.password != null
            ? await argon.hash(updateUserDto.password)
            : undefined,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  findTransactions(id: number) {
    // Ordinare
    // Caricamento progressivo
    return this.findAchieveds(id) && this.findPurchases(id);
  }

  findPurchases(id: number) {
    return this.prisma.purchase.findMany({
      where: {
        userId: id,
      },
    });
  }

  findAchieveds(id: number) {
    return this.prisma.award.findMany({
      where: {
        users: {
          some: {
            user: {
              id: id,
            },
          },
        },
      },
    });
  }
}
