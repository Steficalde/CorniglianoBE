import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Query
} from "@nestjs/common";
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Body() createShopDto: CreateShopDto,
  ) {
    return this.shopService.create(createUserDto, createShopDto);
  }

  @Get()
  findAll(@Query('cursor') cursor?: number,) {
    return this.shopService.findAll(cursor);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Body() updateShopDto: UpdateShopDto,
  ) {
    return this.shopService.update(+id, updateUserDto, updateShopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopService.remove(+id);
  }
}
