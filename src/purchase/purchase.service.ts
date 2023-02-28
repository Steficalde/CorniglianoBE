import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class PurchaseService {

  constructor(private prisma: PrismaService) {}
  create(createPurchaseDto: CreatePurchaseDto) {
    return this.prisma.purchase.create({
      data: {
        points: createPurchaseDto.points,
        shopId: createPurchaseDto.shopId,
        userId:createPurchaseDto.userId,
      }
    });
  }

  findAll() {
    return this.prisma.purchase.findMany();
  }
  findOne(id: number) {
    return this.prisma.purchase.findUnique({
      where: {
        id: id,
      }
    });
  }

  update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    return this.prisma.purchase.update({
      data: {
        points: updatePurchaseDto.points,
        shopId: updatePurchaseDto.shopId,
        userId: updatePurchaseDto.userId
      },
      where: {
        id: id,
      }
    });
  }

  remove(id: number) {
    return this.prisma.purchase.delete({
      where: {
        id: id,
      }
    });
  }
}
