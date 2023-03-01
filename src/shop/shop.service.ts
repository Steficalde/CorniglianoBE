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

  findAll() {
    return this.prisma.shop.findMany();
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
    await this.userService.update(id,updateUserDto);
  }

  remove(id: number) {
    return this.prisma.shop.delete({
      where: {
        id: id,
      },
    });
  }
}
