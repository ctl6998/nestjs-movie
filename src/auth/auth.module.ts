import { Module } from '@nestjs/common';
import { QuanLyNguoiDungModule } from 'src/quan-ly-nguoi-dung/quan-ly-nguoi-dung.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    QuanLyNguoiDungModule, 
    PassportModule,
    JwtModule.register({})
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
