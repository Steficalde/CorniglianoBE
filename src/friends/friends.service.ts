import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FriendsService {

  constructor(private prisma: PrismaService) {
  }
  async create(createFriendDto: CreateFriendDto) {
    await this.prisma.friend.create({
      data: {
        ...createFriendDto
      }
    })
  }

  async update(id: number, updateFriendDto: UpdateFriendDto) {
    await this.prisma.friend.update({
      where: {
        id: id,
      },
      data: {
        userId: updateFriendDto.userId,
        friendId: updateFriendDto.friendId,
        verifiedAt: updateFriendDto.verifiedAt ? new Date() : null,
      }
    })
  }

  async remove(id: number) {
    await this.prisma.friend.delete({
      where: {
        id: id,
      }
    })
  }
}
