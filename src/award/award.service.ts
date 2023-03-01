import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as argon from 'argon2';
import { Award, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AwardService {
  constructor(private prisma: PrismaService) {}
  async create(createAwardDto: CreateAwardDto) {
    let award: Award;
    try {
      award = await this.prisma.award.create({
        data: {
          title: createAwardDto.title,
          description: createAwardDto.description,
          quantity: createAwardDto.quantity,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Credentials taken');
      }
      throw error;
    }
    return award;
  }

  findAll() {
    return this.prisma.award.findMany();
  }

  async findOne(id: number) {
    return this.prisma.award.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateAwardDto: UpdateAwardDto) {
    this.prisma.award.update({
      where: {
        id: id,
      },
      data: {
        title: updateAwardDto.title,
        description: updateAwardDto.description,
        quantity: updateAwardDto.quantity,
      },
    });
  }

  remove(id: number) {
    this.prisma.award.delete({
      where: {
        id: id,
      },
    });
  }
}
