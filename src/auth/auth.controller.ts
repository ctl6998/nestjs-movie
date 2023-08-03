import { Controller } from '@nestjs/common';
import { Post, Body, UseGuards } from '@nestjs/common';
import { NguoiDung } from '@prisma/client';
import { AuthService } from './auth.service';
import { userLoginType } from './entities/auth.entities';
import { NguoiDungDto } from './entities/auth.entities';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('/api/QuanLyNguoiDung')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // @UseGuards(LocalAuthGuard)
    @Post("DangNhap")
    login(@Body() userLogin: userLoginType) {
      return this.authService.login(userLogin);
    }
  
    @Post("DangKy")
    signUp(@Body() userSignUp: NguoiDungDto) {
      return this.authService.signUp(userSignUp);
    }
}
