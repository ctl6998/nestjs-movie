import { Controller, Post } from '@nestjs/common';
import { QuanLyNguoiDungService } from './quan-ly-nguoi-dung.service';
import { Get, Body, Request } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NguoiDungDtoForAdminUpdate } from 'src/auth/entities/auth.entities';

@Controller('api/QuanLyNguoiDung')
export class QuanLyNguoiDungController {
    constructor(private readonly QuanLyNguoiDungService: QuanLyNguoiDungService) {}

    @Get('LayDanhSachLoaiNguoiDung')
    LayDanhSachLoaiNguoiDung() {
        return this.QuanLyNguoiDungService.GetDanhSachLoaiNguoiDung();
    }

    @Get('LayDanhSachNguoiDung')
    LayDanhSachNguoiDung(
        @Body('MaNhom') MaNhom: string,
        @Body('tuKhoa') tuKhoa: string
    ) {
        return this.QuanLyNguoiDungService.GetDanhSachNguoiDung(MaNhom,tuKhoa);
    }

    @Get('LayDanhSachNguoiDungPhanTrang')
    LayDanhSachNguoiDungPhanTrang(
        @Body('MaNhom') MaNhom: string,
        @Body('tuKhoa') tuKhoa: string,
        @Body('soTrang') soTrang: string,
        @Body('soPhanTuTrenTrang') soPhanTuTrenTrang: string
    ) {
        return this.QuanLyNguoiDungService.GetDanhSachNguoiDungPhanTrang(MaNhom,tuKhoa,Number(soTrang),Number(soPhanTuTrenTrang));
    }

    @Get('TimKiemNguoiDung')
    TimKiemDanhSachNguoiDung(
        @Body('MaNhom') MaNhom: string,
        @Body('tuKhoa') tuKhoa: string
    ) {
        return this.QuanLyNguoiDungService.GetDanhSachNguoiDung(MaNhom,tuKhoa);
    }

    @Get('TimKiemNguoiDungPhanTrang')
    TimKiemDanhSachNguoiDungPhanTrang(
        @Body('MaNhom') MaNhom: string,
        @Body('tuKhoa') tuKhoa: string,
        @Body('soTrang') soTrang: string,
        @Body('soPhanTuTrenTrang') soPhanTuTrenTrang: string
    ) {
        return this.QuanLyNguoiDungService.GetDanhSachNguoiDungPhanTrang(MaNhom,tuKhoa,Number(soTrang),Number(soPhanTuTrenTrang));
    }

    @UseGuards(JwtAuthGuard)
    @Post('ThongTinTaiKhoan')
    ThongTinTaiKhoan(@Request() req) {
        return this.QuanLyNguoiDungService.PostThongTinTaiKhoan(req.user.payload.email)
    }

    @UseGuards(JwtAuthGuard)
    @Post('LayThongTinNguoiDung')
    LayThongTinNguoiDung(
        @Request() req,
        @Body('taiKhoan') taiKhoan: string,
    ) {
        return this.QuanLyNguoiDungService.PostThongTinNguoiDung(req.user.payload.loai_nguoi_dung,taiKhoan)
    }

    @UseGuards(JwtAuthGuard)
    @Post('ThemNguoiDung')
    ThemNguoiDung(
        @Request() req,
        @Body() newUser: NguoiDungDtoForAdminUpdate
    ) {
        return this.QuanLyNguoiDungService.PostThemNguoiDung(req.user.payload.loai_nguoi_dung,newUser)
    }
}
