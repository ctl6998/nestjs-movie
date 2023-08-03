
import { IsMaLoaiNguoiDung } from "../decorator/ma-loai-nguoi-dung.decorator";
import { IsString } from 'class-validator';

export class userLoginType {
    email: string;
    mat_khau: string;
}

export class NguoiDungDto  {
    ho_ten: string | null;
    email: string | null;
    mat_khau: string | null;
    so_dt: string | null;

    @IsString()
    @IsMaLoaiNguoiDung()
    loai_nguoi_dung: string | null;
}

export class NguoiDungDtoForAdminUpdate {
    email: string | null;
    matKhau: string | null;
    soDt: string | null;

    @IsString()
    @IsMaLoaiNguoiDung()
    maLoaiNguoiDung: string | null;
    
    hoTen: string | null;
}

export class NguoiDungDtoForUpdate {
    email: string | null;
    matKhau: string | null;
    soDt: string | null;

    @IsString()
    @IsMaLoaiNguoiDung()
    maLoaiNguoiDung: string | null;
    
    hoTen: string | null;
}
