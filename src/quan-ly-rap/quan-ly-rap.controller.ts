import { Controller } from '@nestjs/common';
import { Get, Param, Body } from '@nestjs/common';
import { QuanLyRapService } from './quan-ly-rap.service';

@Controller('api/QuanLyRap')
export class QuanLyRapController {
  constructor(private readonly QuanLyRapService: QuanLyRapService) {}
  
  @Get()
  findAll() {
    return this.QuanLyRapService.findAll();
  }
  
  @Get('LayThongTinHeThongRap')
  findOne(@Body('maHeThongRap') maHeThongRap: string) {
    return this.QuanLyRapService.findOne(Number(maHeThongRap));
  }

  @Get('LayThongTinCumRapTheoHeThong')
  findAllCumRap(@Body('maHeThongRap') maHeThongRap: string) {
    return this.QuanLyRapService.findAllCumRap(Number(maHeThongRap));
  }

  @Get('LayThongTinLichChieuHeThongRap')
  findAllLichChieu(@Body('maHeThongRap') maHeThongRap: string) {
    return this.QuanLyRapService.findAllLichChieu(Number(maHeThongRap));
  }

  @Get('LayThongTinLichChieuPhim')
  findAllLichChieuPhim(@Body('MaPhim') maPhim: string) {
    return this.QuanLyRapService.findAllLichChieuPhim(Number(maPhim));
  }
}

