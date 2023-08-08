import { Injectable } from '@nestjs/common';
import { QuanLyNguoiDungService } from 'src/quan-ly-nguoi-dung/quan-ly-nguoi-dung.service';
import { JwtService } from '@nestjs/jwt';
import { NguoiDung } from '@prisma/client';
import { userLoginType } from './entities/auth.entities';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { NguoiDungDto } from './entities/auth.entities';


@Injectable()
export class AuthService {
  constructor(
    private QuanLyNguoiDungService: QuanLyNguoiDungService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  prisma = new PrismaClient();

  async validateUser(email: string, pass: string): Promise<any> {
    const nguoiDung = await this.QuanLyNguoiDungService.findOne(email);
    if (nguoiDung) {
      const kiemTraMatKhau = await bcrypt.compare(pass, nguoiDung.mat_khau);
      if (kiemTraMatKhau) {
        const { mat_khau, ...result } = nguoiDung;
        return true;
      }
    }
    return false;
  }

  async login(userLogin: userLoginType) {
    const userCheck = await this.validateUser(userLogin.email, userLogin.mat_khau);
    if (!userCheck) {
      return {
        status: 'error',
        message: `Account hay Password sai rồi em ơi.`,
      };
    }

    const nguoiDung = await this.QuanLyNguoiDungService.findOne(userLogin.email);

    const payload = { 
      email: nguoiDung.email,
      loai_nguoi_dung: nguoiDung.loai_nguoi_dung,
      tai_khoan: nguoiDung.tai_khoan
    };
    return {
      status: 'success',
      message: 'Đăng nhập thành công!',
      userrole: nguoiDung.loai_nguoi_dung,
      access_token: this.jwtService.sign(payload, {
        expiresIn: '180m',
        secret: this.config.get('SECRET_KEY'),
      }),
    };
  }

  async signUp(userSignUp: NguoiDungDto) {
    try {
      const existingUser = await this.prisma.nguoiDung.findUnique({
        where: {
          email: userSignUp.email,
        },
      });

      const existingPhoneNumber = await this.prisma.nguoiDung.findUnique({
        where: {
          so_dt: userSignUp.so_dt,
        }
      })

      if (existingUser) {
        return {
          status: 'error',
          message: `Email ${userSignUp.email} đã có người sử dụng`,
        };
      }

      if (existingPhoneNumber) {
        return {
          status: 'error',
          message: `Số điện thoại ${userSignUp.so_dt} đã có người sử dụng`,
        };
      }

      const hashedPassword = await bcrypt.hash(userSignUp.mat_khau, 10);

      const newUser = await this.prisma.nguoiDung.create({
        data: {
          ho_ten: userSignUp.ho_ten,
          email: userSignUp.email,
          so_dt: userSignUp.so_dt,
          mat_khau: hashedPassword,
          loai_nguoi_dung: userSignUp.loai_nguoi_dung,
          is_remove: false
        },
      });

      return {
        status: 'success',
        message: 'Đăng ký thành công rồi nhớ!',
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create user.');
    }
  }
}
