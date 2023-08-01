import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuanLyRapController } from './quan-ly-rap/quan-ly-rap.controller';
import { QuanLyRapModule } from './quan-ly-rap/quan-ly-rap.module';
import { QuanLyRapService } from './quan-ly-rap/quan-ly-rap.service';

@Module({
  imports: [QuanLyRapModule],
  controllers: [AppController, QuanLyRapController],
  providers: [AppService, QuanLyRapService],
})
export class AppModule {}
