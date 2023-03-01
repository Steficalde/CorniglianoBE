import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  async reset() {
    // run prisma migrate reset
    await this.prisma.user.createMany({
      data: [
        {
          email: "mariorossi@gmail.com",
          hash: await argon.hash("mariorossi"),
        },
        {
          email: "matteorenzi@gmail.com",
          hash: await argon.hash("matteorenzi"),
        },
        {
          email: "chiaraferro@gmail.com",
          hash: await argon.hash("chiaraferro"),
        },
        {
          id: 100,
          email: "mastrocostru@gmail.com",
          hash: await argon.hash("mastrocostru"),
        },
        {
          id: 101,
          email: "dakawa@gmail.com",
          hash: await argon.hash("dakawa"),
        }
      ],
    });
    await this.prisma.shop.createMany({
      data: [
        {
          id: 100,
          googleMaps: "google mappa",
          address: "corso cornigliano 7",
          name: "shop uno",
          description: "1 ginogino"
        },
        {
          id: 101,
          isActive: false,
          googleMaps: "google mappa",
          address: "corso magellano 14",
          name: "shop due",
          description: "2 ginogino"
        }
      ],
    });

    return "reset";
  }
}
