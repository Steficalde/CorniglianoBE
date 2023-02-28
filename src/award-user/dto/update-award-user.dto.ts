import { PartialType } from '@nestjs/mapped-types';
import { CreateAwardUserDto } from './create-award-user.dto';

export class UpdateAwardUserDto extends PartialType(CreateAwardUserDto) {}
