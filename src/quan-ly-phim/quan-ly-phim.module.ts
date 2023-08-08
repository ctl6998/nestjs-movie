import { Module } from '@nestjs/common';
import { QuanLyPhimService } from './quan-ly-phim.service';

@Module({
  providers: [QuanLyPhimService],
})
export class QuanLyPhimModule {}
