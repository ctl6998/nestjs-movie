import { Module } from '@nestjs/common';
import { QuanLyDatVeController } from './quan-ly-dat-ve.controller';
import { QuanLyDatVeService } from './quan-ly-dat-ve.service';

@Module({
  providers: [QuanLyDatVeService],
})
export class QuanLyDatVeModule {}
