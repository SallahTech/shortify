import { Test, TestingModule } from '@nestjs/testing';
import { CtaService } from './cta.service';

describe('CtaService', () => {
  let service: CtaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CtaService],
    }).compile();

    service = module.get<CtaService>(CtaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
