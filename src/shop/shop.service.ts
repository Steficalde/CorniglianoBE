import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ShopService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}
  async create(createUserDto: CreateUserDto, createShopDto: CreateShopDto) {
    const user = await this.userService.create(createUserDto);
    await this.prisma.shop.create({
      data: {
        id: user.id,
        isActive: true,
        address: createShopDto.address,
        googleMaps: createShopDto.googleMaps,
        description: createShopDto.description,
        name: createShopDto.name,
      },
    });
  }

  async findAll(cursor?: number) {
    const results = 3;
    const data =
      cursor == null
        ? await this.prisma.shop.findMany({
            take: results,
            where: {
              isActive: true,
            },
            select: {
              id: true,
              name: true,
              user: {
                select: {
                  avatar: true,
                },
              },
            },
            orderBy: {
              id: 'desc',
            },
          })
        : await this.prisma.shop.findMany({
            take: results,
            skip: 1, // Skip the cursor
            cursor: {
              id: +cursor,
            },
            where: {
              isActive: true,
            },
            select: {
              id: true,
              name: true,
              user: {
                select: {
                  avatar: true,
                },
              },
            },
            orderBy: {
              id: 'desc',
            },
          });


    return {
      cursor: data[data.length - 1].id,
      data: data,
    }
  }

  findOne(id: number) {
    return this.prisma.shop.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    updateShopDto: UpdateShopDto,
  ) {
    await this.prisma.shop.update({
      where: {
        id: id,
      },
      data: {
        address: updateShopDto.address,
        googleMaps: updateShopDto.googleMaps,
        isActive: updateShopDto.isActive,
        description: updateShopDto.description,
        name: updateShopDto.name,
      },
    });
    await this.userService.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.prisma.shop.delete({
      where: {
        id: id,
      },
    });
  }
}
