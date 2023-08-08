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
import { QuanLyPhimController } from './quan-ly-phim/quan-ly-phim.controller';
import { QuanLyPhimModule } from './quan-ly-phim/quan-ly-phim.module';
import { QuanLyPhimService } from './quan-ly-phim/quan-ly-phim.service';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    QuanLyRapModule, 
    QuanLyNguoiDungModule, 
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    QuanLyPhimModule,
    ServeStaticModule.forRoot({
      rootPath: ".",
    })
  ],
  controllers: [AppController, QuanLyRapController, QuanLyNguoiDungController, QuanLyPhimController],
  providers: [AppService, QuanLyRapService, QuanLyNguoiDungService, QuanLyPhimService],
})
export class AppModule {}
