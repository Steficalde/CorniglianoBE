import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ShopModule } from './shop/shop.module';
import { PurchaseModule } from './purchase/purchase.module';
import { AwardModule } from './award/award.module';
import { AwardUserModule } from './award-user/award-user.module';
import {TestModule} from "./test/test.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    ShopModule,
    PurchaseModule,
    AwardModule,
    AwardUserModule,
    TestModule,
  ],
})
export class AppModule {}
