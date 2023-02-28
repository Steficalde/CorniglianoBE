import { Test, TestingModule } from '@nestjs/testing';
import { AwardUserController } from './award-user.controller';
import { AwardUserService } from './award-user.service';

describe('AwardUserController', () => {
  let controller: AwardUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwardUserController],
      providers: [AwardUserService],
    }).compile();

    controller = module.get<AwardUserController>(AwardUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
