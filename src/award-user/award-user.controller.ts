import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AwardUserService } from './award-user.service';
import { CreateAwardUserDto } from './dto/create-award-user.dto';
import { UpdateAwardUserDto } from './dto/update-award-user.dto';

@Controller('award-user')
export class AwardUserController {
  constructor(private readonly awardUserService: AwardUserService) {}

  @Post()
  create(@Body() createAwardUserDto: CreateAwardUserDto) {
    return this.awardUserService.create(createAwardUserDto);
  }

  @Get()
  findAll() {
    return this.awardUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.awardUserService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.awardUserService.remove(+id);
  }
}
