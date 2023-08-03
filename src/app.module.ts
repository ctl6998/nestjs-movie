import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuanLyRapController } from './quan-ly-rap/quan-ly-rap.controller';
import { QuanLyRapModule } from './quan-ly-rap/quan-ly-rap.module';
import { QuanLyRapService } from './quan-ly-rap/quan-ly-rap.service';
import { QuanLyNguoiDungController } from './quan-ly-nguoi-dung/quan-ly-nguoi-dung.controller';
import { QuanLyNguoiDungModule } from './quan-ly-nguoi-dung/quan-ly-nguoi-dung.module';
import { QuanLyNguoiDungService } from './quan-ly-nguoi-dung/quan-ly-nguoi-dung.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    QuanLyRapModule, 
    QuanLyNguoiDungModule, 
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
  ],
  controllers: [AppController, QuanLyRapController, QuanLyNguoiDungController],
  providers: [AppService, QuanLyRapService, QuanLyNguoiDungService],
})
export class AppModule {}
