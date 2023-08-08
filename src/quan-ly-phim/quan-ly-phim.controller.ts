import {
  Controller,
  Delete,
  UploadedFiles,
  Body,
  Get,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Put
} from '@nestjs/common';
import { QuanLyPhimService } from './quan-ly-phim.service';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  formDataPhim,
  formDataPhimUpdate,
} from './entities/quan-ly-phim.entities';
import { multerConfig, multerConfig2 } from './config/multer.config';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/QuanLyPhim')
export class QuanLyPhimController {
  constructor(private readonly QuanLyPhimService: QuanLyPhimService) {}

  @Get('LayDanhSachBanner')
  LayDanhSachBanner() {
    return this.QuanLyPhimService.GetDanhSachBanner();
  }

  @Get('LayDanhSachPhim')
  LayDanhSachPhim() {
    return this.QuanLyPhimService.GetDanhSachPhim();
  }

  @Get('LayDanhSachPhimPhanTrang')
  LayDanhSachNguoiDungPhanTrang(
    @Body('tenPhim') tenPhim: string,
    @Body('soTrang') soTrang: string,
    @Body('soPhanTuTrenTrang') soPhanTuTrenTrang: string,
  ) {
    return this.QuanLyPhimService.GetDanhSachPhimPhanTrang(
      tenPhim,
      Number(soTrang),
      Number(soPhanTuTrenTrang),
    );
  }

  @Get('LayDanhSachPhimTheoNgay')
  LayDanhSachPhimTheoNgay(
    @Body('tenPhim') tenPhim: string,
    @Body('soTrang') soTrang: string,
    @Body('soPhanTuTrenTrang') soPhanTuTrenTrang: string,
    @Body('tuNgay') tuNgay: string,
    @Body('denNgay') denNgay: string,
  ) {
    return this.QuanLyPhimService.GetDanhSachPhimTheoNgay(
      tenPhim,
      Number(soTrang),
      Number(soPhanTuTrenTrang),
      tuNgay,
      denNgay,
    );
  }

  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'hinhAnhUpload' }, { name: 'bannerUpload' }],
      multerConfig,
    ),
  )
  @Post('ThemPhimUploadHinh')
  ThemPhimUploadHinh(
    @UploadedFiles()
    fileUpload: {
      hinhAnhUpload?: Express.Multer.File;
      bannerUpload?: Express.Multer.File;
    },
    @Body() formData: formDataPhim,
  ) {
    return this.QuanLyPhimService.PostThemPhimUploadHinh(fileUpload, formData);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'hinhAnhUpload' }, { name: 'bannerUpload' }],
      multerConfig,
    ),
  )
  @Post('CapNhatPhimUpload')
  CapNhatPhimUpload(
    @UploadedFiles()
    fileUpload: {
      hinhAnhUpload?: Express.Multer.File;
      bannerUpload?: Express.Multer.File;
    },
    @Request() req,
    @Body() formData: formDataPhimUpdate,
  ) {
    return this.QuanLyPhimService.PostCapNhatPhimUpload(
      req.user.payload.loai_nguoi_dung,
      fileUpload,
      formData,
    );
  }

  @Post()
  QuanLyPhim() {
    return 'General endpoint';
  }

  @UseGuards(JwtAuthGuard)
  @Put('XoaPhim')
  XoaPhim(
    @Body('MaPhim') maPhim: string
  ) {
    return this.QuanLyPhimService.DeleteXoaPhim(maPhim)
  }

  @UseGuards(JwtAuthGuard)
  @Put('XP')
  XoaPhimXP(
    @Body('MaPhim') maPhim: string
  ) {
    return this.QuanLyPhimService.DeleteXoaPhim(maPhim)
  }

  @Get('LayThongTinPhim')
  LayThongTinPhim(
    @Body('MaPhim') maPhim: string
  ) {
    return this.QuanLyPhimService.GetLayThongTinPhim(maPhim)
  }
}
