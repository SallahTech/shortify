import { Test, TestingModule } from '@nestjs/testing';
import { CtaController } from './cta.controller';

describe('CtaController', () => {
  let controller: CtaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CtaController],
    }).compile();

    controller = module.get<CtaController>(CtaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
