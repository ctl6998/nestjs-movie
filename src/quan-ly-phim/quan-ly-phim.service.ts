import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  formDataPhim,
  formDataPhimUpdate,
} from './entities/quan-ly-phim.entities';

@Injectable()
export class QuanLyPhimService {
  prisma = new PrismaClient();

  async GetDanhSachBanner() {
    const data = await this.prisma.banner.findMany();
    return data;
  }

  async GetDanhSachPhim() {
    const data = await this.prisma.phim.findMany({
      where: {
        is_remove: false,
      },
      include: {
        LichChieu: true,
      },
    });
    return data;
  }

  async GetDanhSachPhimPhanTrang(
    tenPhim: string,
    soTrang: number,
    soPhanTuTrenTrang: number,
  ) {
    const skipItems = (soTrang - 1) * soPhanTuTrenTrang;

    const data = await this.prisma.phim.findMany({
      where: {
        AND: [
          tenPhim ? { ten_phim: { contains: tenPhim } } : undefined,
          { is_remove: false },
        ],
      },
      include: {
        LichChieu: true,
      },
      skip: skipItems,
      take: soPhanTuTrenTrang,
    });

    const totalData = await this.prisma.phim.count({
      where: {
        AND: [tenPhim ? { ten_phim: { contains: tenPhim } } : undefined],
      },
    });

    const totalPages = Math.ceil(totalData / soPhanTuTrenTrang);

    return {
      tongSoTrang: totalPages,
      data,
    };
  }

  async GetDanhSachPhimTheoNgay(
    tenPhim: string,
    soTrang: number,
    soPhanTuTrenTrang: number,
    tuNgayStr: string,
    denNgayStr: string,
  ) {
    const skipItems = (soTrang - 1) * soPhanTuTrenTrang;

    const tuNgay = new Date(tuNgayStr);
    const denNgay = new Date(denNgayStr);
    denNgay.setDate(denNgay.getDate() + 1);

    const tuNgayISOString = tuNgay.toISOString();
    const denNgayISOString = denNgay.toISOString();

    const data = await this.prisma.phim.findMany({
      where: {
        AND: [
          tenPhim ? { ten_phim: { contains: tenPhim } } : undefined,
          { is_remove: false },
        ],
        LichChieu: {
          some: {
            ngay_gio_chieu: {
              gte: tuNgayISOString,
              lte: denNgayISOString,
            },
          },
        },
      },
      include: {
        LichChieu: true,
      },
      skip: skipItems,
      take: soPhanTuTrenTrang,
    });

    const totalData = await this.prisma.phim.count({
      where: {
        AND: [
          tenPhim ? { ten_phim: { contains: tenPhim } } : undefined,
          { is_remove: false },
        ],
        LichChieu: {
          some: {
            ngay_gio_chieu: {
              gte: tuNgayISOString,
              lte: denNgayISOString,
            },
          },
        },
      },
    });

    const totalPages = Math.ceil(totalData / soPhanTuTrenTrang);

    return {
      tongSoTrang: totalPages,
      data,
    };
  }

  async PostThemPhimUploadHinh(
    fileUpload: {
      hinhAnhUpload?: Express.Multer.File;
      bannerUpload?: Express.Multer.File;
    },
    formData: formDataPhim,
  ) {
    try {
      const {
        tenPhim,
        trailer,
        moTa,
        ngayKhoiChieu,
        danhGia,
        hot,
        dangChieu,
        sapChieu,
      } = formData;
      const { hinhAnhUpload, bannerUpload } = fileUpload;

      const newPhim = await this.prisma.phim.create({
        data: {
          ten_phim: tenPhim,
          trailer,
          hinh_anh: hinhAnhUpload[0].filename,
          mo_ta: moTa,
          ngay_khoi_chieu: new Date(ngayKhoiChieu).toISOString(),
          danh_gia: Number(danhGia),
          hot: Boolean(hot),
          dang_chieu: Boolean(dangChieu),
          sap_chieu: Boolean(sapChieu),
          is_remove: false
        },
      });

      const newBanner = await this.prisma.banner.create({
        data: {
          ma_phim: newPhim.ma_phim,
          hinh_anh: bannerUpload[0].filename,
          is_remove: false
        },
      });

      return {
        hinhAnhUpload,
        bannerUpload,
        status: 'success',
        newPhim,
        newBanner,
      };
    } catch (error) {
      console.error('Error while creating:', error);
      throw new Error('Failed to create film.');
    }
  }

  async PostCapNhatPhimUpload(
    loai_nguoi_dung,
    fileUpload: {
      hinhAnhUpload?: Express.Multer.File;
      bannerUpload?: Express.Multer.File;
    },
    formData: formDataPhimUpdate,
  ) {
    try {
      const {
        maPhim,
        tenPhim,
        trailer,
        moTa,
        ngayKhoiChieu,
        danhGia,
        hot,
        dangChieu,
        sapChieu,
      } = formData;
      const { hinhAnhUpload, bannerUpload } = fileUpload;

      if (loai_nguoi_dung !== 'Admin') {
        return {
          status: 'error',
          userrole: loai_nguoi_dung,
          message: 'Only Admin account can update Phim',
        };
      }

      const existingPhim = await this.prisma.phim.findUnique({
        where: {
          ma_phim: Number(maPhim),
        },
      });

      if (!existingPhim) {
        return {
          status: 'error',
          message: `Phim với mã phim ${maPhim} không tồn tại.`,
        };
      }

      const updatePhim = await this.prisma.phim.update({
        where: {
          ma_phim: Number(maPhim),
        },
        data: {
          ten_phim: tenPhim,
          trailer,
          hinh_anh: hinhAnhUpload[0].filename,
          mo_ta: moTa,
          ngay_khoi_chieu: new Date(ngayKhoiChieu).toISOString(),
          danh_gia: Number(danhGia),
          hot: Boolean(hot),
          dang_chieu: Boolean(dangChieu),
          sap_chieu: Boolean(sapChieu),
        },
      });

      const updateBanner = await this.prisma.banner.updateMany({
        where: {
          ma_phim: Number(maPhim),
        },
        data: {
          hinh_anh: bannerUpload[0].filename,
        },
      });

      return {
        hinhAnhUpload,
        bannerUpload,
        status: 'success',
        message: 'update phim successfully!',
      };
    } catch (error) {
      console.error('Error while updating:', error);
      throw new Error('Failed to update.');
    }
  }

  async DeleteXoaPhim(maPhim: string) {
    try {
      const existingPhim = await this.prisma.phim.findUnique({
        where: {
          ma_phim: Number(maPhim),
        },
      });

      if (!existingPhim) {
        return {
          status: 'error',
          message: `Phim với mã phim ${maPhim} không tồn tại.`,
        };
      }

      const deletePhim = await this.prisma.phim.update({
        where: {
          ma_phim: Number(maPhim),
        },
        data: {
          is_remove: true,
        },
      });

      return {
        status: 'success',
        message: 'delete phim successfully',
      };
    } catch (error) {
      console.error('Error while deleting:', error);
      throw new Error('Failed to delete.');
    }
  }

  async GetLayThongTinPhim(maPhim: string) {
    try {
      const existingPhim = await this.prisma.phim.findUnique({
        where: {
          ma_phim: Number(maPhim),
        },
      });

      if (!existingPhim) {
        return {
          status: 'error',
          message: `Phim với mã phim ${maPhim} không tồn tại.`,
        };
      }

      const data = await this.prisma.phim.findFirst({
        where: {
          ma_phim: Number(maPhim)
        }
      })
      return data
    } catch(error) {
      console.error(error);
    }
  }

}
