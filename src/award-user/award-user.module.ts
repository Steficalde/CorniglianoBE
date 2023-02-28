import { Module } from '@nestjs/common';
import { AwardUserService } from './award-user.service';
import { AwardUserController } from './award-user.controller';

@Module({
  controllers: [AwardUserController],
  providers: [AwardUserService]
})
export class AwardUserModule {}
