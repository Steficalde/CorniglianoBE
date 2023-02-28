import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto, createShopDto: CreateShopDto) {
    //creo l'utente
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

    //creo lo shop collegato all'utente
    const shop = await this.prisma.shop.create({
      data: {
        id: user.id,
        isActive: true,
        address: createShopDto.address,
        googleMaps: createShopDto.googleMaps,
        description: createShopDto.description,
        name: createShopDto.name
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
    const shopUpdated = await this.prisma.shop.update({
      where: {
        id: id,
      },
      data: {
        address: updateShopDto.address,
        googleMaps: updateShopDto.googleMaps,
        isActive: updateShopDto.isActive,
        description: updateShopDto.description,
        name: updateShopDto.name
      },
    });
    const userUpdated = await this.prisma.user.update({
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
    return this.prisma.shop.delete({
      where: {
        id: id,
      },
    });
  }
}
