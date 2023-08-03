import { Module } from '@nestjs/common';
import { QuanLyNguoiDungController } from './quan-ly-nguoi-dung.controller';
import { QuanLyNguoiDungService } from './quan-ly-nguoi-dung.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [QuanLyNguoiDungService],
  controllers: [QuanLyNguoiDungController],
  exports: [QuanLyNguoiDungService]
})
export class QuanLyNguoiDungModule {}
