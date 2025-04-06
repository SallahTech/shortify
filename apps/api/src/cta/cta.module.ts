import { Module } from '@nestjs/common';
import { CtaService } from './cta.service';
import { CtaController } from './cta.controller';

@Module({
  providers: [CtaService],
  controllers: [CtaController]
})
export class CtaModule {}
