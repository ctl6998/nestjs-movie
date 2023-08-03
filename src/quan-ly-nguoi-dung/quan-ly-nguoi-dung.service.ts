import { Injectable } from '@nestjs/common';
import { NguoiDung, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { NguoiDungDtoForAdminUpdate } from 'src/auth/entities/auth.entities';

@Injectable()
export class QuanLyNguoiDungService {
  prisma = new PrismaClient();

  async findOne(email: string) {
    const data = await this.prisma.nguoiDung.findUnique({
      where: {
        email: email,
      },
    });
    return data;
  }

  async GetDanhSachLoaiNguoiDung() {
    const data = await this.prisma.nguoiDung.findMany({
      distinct: ['loai_nguoi_dung'],
      select: {
        loai_nguoi_dung: true,
      },
    });
    return data;
  }

  async GetDanhSachNguoiDung(MaNhom: string, tuKhoa: string) {
    try {
      const data = await this.prisma.nguoiDung.findMany({
        where: {
          AND: [
            { loai_nguoi_dung: MaNhom },
            tuKhoa ? { ho_ten: { contains: tuKhoa } } : undefined,
            { is_remove: false },
          ],
        },
        select: {
          tai_khoan: true,
          ho_ten: true,
          email: true,
          so_dt: true,
          loai_nguoi_dung: true,
        },
      });
      return data;
    } catch (error) {
      console.error('Error retrieving NguoiDung:', error);
      throw error;
    }
  }

  async GetDanhSachNguoiDungPhanTrang(
    MaNhom: string,
    tuKhoa: string,
    soTrang: number,
    soPhanTuTrenTrang: number,
  ) {
    const skipItems = (soTrang - 1) * soPhanTuTrenTrang;

    const data = await this.prisma.nguoiDung.findMany({
      where: {
        AND: [
          { loai_nguoi_dung: MaNhom },
          tuKhoa ? { ho_ten: { contains: tuKhoa } } : undefined,
          { is_remove: false },
        ],
      },
      select: {
        tai_khoan: true,
        ho_ten: true,
        email: true,
        so_dt: true,
        loai_nguoi_dung: true,
      },
      skip: skipItems,
      take: soPhanTuTrenTrang,
    });

    const totalData = await this.prisma.nguoiDung.count({
      where: {
        AND: [
          { loai_nguoi_dung: MaNhom },
          tuKhoa ? { ho_ten: { contains: tuKhoa } } : undefined,
        ],
      },
    });

    const totalPages = Math.ceil(totalData / soPhanTuTrenTrang);

    return {
      data,
      totalPages,
    };
  }

  async PostThongTinTaiKhoan(email: string) {
    const data = await this.prisma.nguoiDung.findUnique({
      where: {
        email: email,
      },
      include: {
        DatVe: true,
      },
    });
    return data;
  }

  async PostThongTinNguoiDung(loai_nguoi_dung: string, taiKhoan: string) {
    const dataForNormal = await this.prisma.nguoiDung.findUnique({
      where: {
        email: taiKhoan,
      },
      select: {
        tai_khoan: true,
        ho_ten: true,
        email: true,
        loai_nguoi_dung: true,
      },
    });

    const dataForAdmin = await this.prisma.nguoiDung.findUnique({
      where: {
        email: taiKhoan,
      },
    });

    if (loai_nguoi_dung === 'Admin') {
      return {
        status: 'success',
        description: 'for Admin account view only',
        dataForAdmin,
      };
    }

    if (loai_nguoi_dung === 'Normal') {
      return {
        status: 'success',
        description: 'for Normal account view',
        dataForNormal,
      };
    }
  }

  async PostThemNguoiDung(loai_nguoi_dung: string, userSignUp: NguoiDungDtoForAdminUpdate) {
    try {
      if(loai_nguoi_dung !== 'Admin') {
        return {
          status: 'error',
          userrole: loai_nguoi_dung,
          message: 'Only Admin account can add new user!!!'
        }
      }

      const existingUser = await this.prisma.nguoiDung.findUnique({
        where: {
          email: userSignUp.email,
        },
      });

      const existingPhoneNumber = await this.prisma.nguoiDung.findUnique({
        where: {
          so_dt: userSignUp.soDt,
        },
      });

      if (existingUser) {
        return {
          status: 'error',
          message: `Email ${userSignUp.email} đã có người sử dụng`,
        };
      }

      if (existingPhoneNumber) {
        return {
          status: 'error',
          message: `Số điện thoại ${userSignUp.soDt} đã có người sử dụng`,
        };
      }

      const hashedPassword = await bcrypt.hash(userSignUp.matKhau, 10);

      const newUser = await this.prisma.nguoiDung.create({
        data: {
          ho_ten: userSignUp.hoTen,
          email: userSignUp.email,
          so_dt: userSignUp.soDt,
          mat_khau: hashedPassword,
          loai_nguoi_dung: userSignUp.maLoaiNguoiDung,
        },
      });

      return {
        status: 'success',
        userrole: 'Admin',
        message: 'Đã thêm User thành công',
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create user.');
    }
  }

}
