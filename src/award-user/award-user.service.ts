import { Injectable } from '@nestjs/common';
import { CreateAwardUserDto } from './dto/create-award-user.dto';
import { UpdateAwardUserDto } from './dto/update-award-user.dto';

@Injectable()
export class AwardUserService {
  create(createAwardUserDto: CreateAwardUserDto) {
    return 'This action adds a new awardUser';
  }

  findAll() {
    return `This action returns all awardUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} awardUser`;
  }

  update(id: number, updateAwardUserDto: UpdateAwardUserDto) {
    return `This action updates a #${id} awardUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} awardUser`;
  }
}
