import { Module } from '@nestjs/common';
import { QuanLyRapService } from './quan-ly-rap.service';
import { QuanLyRapController } from './quan-ly-rap.controller';

@Module({
  providers: [QuanLyRapService],
  controllers: [QuanLyRapController]
})
export class QuanLyRapModule {}
