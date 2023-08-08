import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DatVeDto, LichChieuDto } from './entities/quan-ly-dat-ve.entities';

@Injectable()
export class QuanLyDatVeService {
  prisma = new PrismaClient();

  async PostDatVe(taiKhoan: number, DatVeDto: DatVeDto) {
    try {
      const { maLichChieu, danhSachVe } = DatVeDto;

      // Kiểm tra lịch chiếu có tồn tại
      const lichChieu = await this.prisma.lichChieu.findUnique({
        where: { ma_lich_chieu: Number(DatVeDto.maLichChieu) },
      });
      if (!lichChieu) {
        return { error: 'Mã lịch chiếu không tồn tại' };
      }

      // Kiểm tra ghế của rạp trong lịch chiếu có tồn tại
      for (const ve of danhSachVe) {
        const ghe = await this.prisma.ghe.findFirst({
          where: {
            AND: [
              { ma_ghe: ve.maGhe },
              { ma_rap: lichChieu.ma_rap },
              { is_remove: false },
            ],
          },
        });
        if (!ghe) {
          return { error: 'Mã ghế không tồn tại' };
        }

        const giaVe = await this.prisma.lichChieu.findFirst({
          where: {
            AND: [{ gia_ve: ve.giaVe }, { is_remove: false }],
          },
        });
        if (!giaVe) {
          return { error: 'Không có giá vé này' };
        }
      }

      // Kiểm tra lịch chiêu + ghế đã được đặt chưa
      for (const ve of danhSachVe) {
        const booked = await this.prisma.datVe.findFirst({
          where: {
            ma_ghe: ve.maGhe,
            ma_lich_chieu: maLichChieu,
          },
        });
        if (booked) {
          return { error: 'Ghế này đã được đặt' };
        }
      }

      const newDatVe = await this.prisma.datVe.create({
        data: {
          tai_khoan: taiKhoan,
          ma_lich_chieu: Number(maLichChieu),
          ma_ghe: Number(danhSachVe[0].maGhe),
          is_remove: false,
        },
      });
      return {
        status: 'Đặt vé thành công!',
        newDatVe,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async GetDanhSachPhongVe(maLichChieu: number) {
    try {
      const data = await this.prisma.lichChieu.findFirst({
        where: {
          ma_lich_chieu: maLichChieu,
        },
        include: {
          DatVe: true,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async PostTaoLichChieu(loai_nguoi_dung: string, lichChieuDto: LichChieuDto) {
    try {
      if (loai_nguoi_dung !== 'Admin') {
        return {
          status: 'error',
          userrole: loai_nguoi_dung,
          message: 'Only Admin account can update Phim',
        };
      }

      const { maPhim, ngayChieuGioChieu, maRap, giaVe } = lichChieuDto;

      // Kiểm tra mã phim có tồn tai
      const phim = await this.prisma.phim.findUnique({
        where: { ma_phim: maPhim },
      });
      if (!phim) {
        return { error: 'Mã Phim không tồn tại' };
      }

      // Kiểm tra ma rạp có tồn tại
      const rapPhim = await this.prisma.rapPhim.findUnique({
        where: { ma_rap: maRap },
      });
      if (!rapPhim) {
        return { error: 'Mã Rạp không tồn tại' };
      }

      // Kiểm tra có trùng khung giờ chiếu
      const existingLichChieu = await this.prisma.lichChieu.findFirst({
        where: {
          ma_phim: maPhim,
          ma_rap: maRap,
          ngay_gio_chieu: new Date(ngayChieuGioChieu),
        },
      });
      if (existingLichChieu) {
        return { error: 'Phim đã được chiếu trong khung giờ này' };
      }

      const lichChieu = await this.prisma.lichChieu.create({
        data: {
          ma_phim: maPhim,
          ngay_gio_chieu: new Date(ngayChieuGioChieu),
          ma_rap: maRap,
          gia_ve: giaVe,
          is_remove: false,
        },
      });

      return {
        status: "Tạo lịch chiếu thành công",
        lichChieu
      }
      
    } catch (error) {
      console.log(error);
    }
  }
}
