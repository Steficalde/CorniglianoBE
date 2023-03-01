import { Injectable } from '@nestjs/common';
import { CreateAwardUserDto } from './dto/create-award-user.dto';
import { UpdateAwardUserDto } from './dto/update-award-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Award } from '@prisma/client';

@Injectable()
export class AwardUserService {
  constructor(private prisma: PrismaService) {}
  async create(createAwardUserDto: CreateAwardUserDto) {
    const award = await this.prisma.award.findUnique({
      where: {
        id: createAwardUserDto.awardId,
      },
    });
    if (award && award.quantity >= 1) {
      //decremento
      this.prisma.award.update({
        where: {
          id: createAwardUserDto.awardId,
        },
        data: {
          quantity: {
            increment: -1,
          },
        },
      });
      //creo il riscatto
      this.prisma.awardUser.create({
        data: {
          userId: createAwardUserDto.userId,
          awardId: createAwardUserDto.awardId,
        },
      });
    }
  }

  findAll() {
    return this.prisma.awardUser.findMany();
  }

  findOne(id: number) {
    return this.prisma.awardUser.findUnique({
      where: {
        id: id,
      },
    });
  }

  remove(id: number) {
    return this.prisma.awardUser.delete({
      where: {
        id: id,
      },
    });
  }
}
