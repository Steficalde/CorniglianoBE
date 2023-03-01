import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import {UserService} from "../user/user.service";

@Module({
  controllers: [ShopController],
  providers: [ShopService, UserService]
})
export class ShopModule {}
