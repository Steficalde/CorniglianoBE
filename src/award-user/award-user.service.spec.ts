import { Test, TestingModule } from '@nestjs/testing';
import { AwardUserService } from './award-user.service';

describe('AwardUserService', () => {
  let service: AwardUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwardUserService],
    }).compile();

    service = module.get<AwardUserService>(AwardUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
