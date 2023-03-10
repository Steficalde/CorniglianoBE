import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';
import { User } from '@prisma/client';

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
          name: createUserDto.name,
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
    try {
      this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: updateUserDto.name,
          email: updateUserDto.email,
          hash:
            updateUserDto.password != null
              ? await argon.hash(updateUserDto.password)
              : undefined,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email taken');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  // This function use a cursor
  async findTransactions(
    id: number,
    purchasesCursor?: number,
    awardsCursor?: number,
  ) {
    const results = 3;
    let awards = [];
    let purchases = [];
    if(awardsCursor != 1){
      awards = await this.findAwards(id, results, awardsCursor);
    }
    if(purchasesCursor != 1){
      purchases = await this.findPurchases(id, results, purchasesCursor);
    }
    // take the last 10 form both, using the cursor
    // Unify and find the latest 10
    let data = [...purchases, ...awards];

    // Order by date
    data.sort(function (a, b) {
      return +b.createdAt - +a.createdAt;
    });

    data = data.slice(0, results);

    // Return the both the updated cursor and the result
    let nextPurchaseCursor: number | null;
    let nextAwardsCursor: number | null;
    // from the last to the first
    for (let i = data.length - 1 ; i >= 0; i--) {
      // if contain shop is a Purchase while if contain award is an AwardUser
      // Check if contains prop 'award'
      if (nextAwardsCursor == null && Object.hasOwn(data[i] , 'award')) {
        nextAwardsCursor = data[i].id;
      }
      // Check if contains prop 'shop'
      if (nextPurchaseCursor == null && Object.hasOwn(data[i], 'shop')) {
        nextPurchaseCursor = data[i].id;
      }
    }
    nextPurchaseCursor ??= purchasesCursor;
    nextAwardsCursor ??= awardsCursor;
    return {
      purchasesCursor: nextPurchaseCursor,
      awardsCursor: nextAwardsCursor,
      data: data,
    };
  }

  findPurchases(id: number, number: number, purchasesCursor?: number) {
    return purchasesCursor == null
      ? this.prisma.purchase.findMany({
          take: number,
          where: {
            userId: id,
          },
          select: {
            id: true,
            createdAt: true,
            points: true,
            shop: {
              select: {
                user: {
                  select: {
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
          orderBy: {
            id: 'desc',
          },
        })
      : this.prisma.purchase.findMany({
          take: number,
          skip: 1, // Skip the cursor
          cursor: {
            id: +purchasesCursor,
          },
          where: {
            userId: id,
          },
          select: {
            id: true,
            createdAt: true,
            points: true,
            shop: {
              select: {
                user: {
                  select: {
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
          orderBy: {
            id: 'desc',
          },
        });
  }

  findAwards(id: number, number: number, awardsCursor?: number) {
    return awardsCursor == null
      ? this.prisma.awardUser.findMany({
          take: number,
          where: {
            userId: id,
          },
          select: {
            id: true,
            createdAt: true,
            award: {
              select: {
                title: true,
                cost: true,
              },
            },
          },
          orderBy: {
            id: 'desc',
          },
        })
      : this.prisma.awardUser.findMany({
          take: number,
          skip: 1, // Skip the cursor
          cursor: {
            id: +awardsCursor,
          },
          where: {
            userId: id,
          },
          select: {
            id: true,
            createdAt: true,
            award: {
              select: {
                title: true,
                cost: true,
              },
            },
          },
          orderBy: {
            id: 'desc',
          },
        });
  }
}
