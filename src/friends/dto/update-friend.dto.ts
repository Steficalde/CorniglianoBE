import { PartialType } from '@nestjs/mapped-types';
import { CreateFriendDto } from './create-friend.dto';
import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateFriendDto extends PartialType(CreateFriendDto) {
  @IsNotEmpty()
  @IsBoolean()
  verifiedAt: boolean;
}
