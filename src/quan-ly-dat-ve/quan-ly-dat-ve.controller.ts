import { Controller, UseGuards, Post, Get, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DatVeDto, LichChieuDto } from './entities/quan-ly-dat-ve.entities';
import { QuanLyDatVeService } from './quan-ly-dat-ve.service';

@Controller('api/QuanLyDatVe')
export class QuanLyDatVeController {
  constructor(private readonly QuanLyDatVeService: QuanLyDatVeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('DatVe')
  DatVe(
    @Body() DatVeDto: DatVeDto,
    @Req() req
  ) {
    return this.QuanLyDatVeService.PostDatVe(req.user.payload.tai_khoan, DatVeDto)
  }

  @Get('LayDanhSachPhongVe')
  LayDanhSachPhongVe(
    @Body('MaLichChieu') maLichChieu: string
  ) {
    return this.QuanLyDatVeService.GetDanhSachPhongVe(Number(maLichChieu))
  }

  @UseGuards(JwtAuthGuard)
  @Post('TaoLichChieu')
  TaoLichChieu(
    @Body() lichChieuDto: LichChieuDto,
    @Req() req
  ) {
    return this.QuanLyDatVeService.PostTaoLichChieu(req.user.payload.loai_nguoi_dung, lichChieuDto )
  }
}
