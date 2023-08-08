export class formDataPhim {
    tenPhim: string | null;
    trailer: string | null;
    hinhAnhUpload: Express.Multer.File | null;
    moTa: string | null;
    ngayKhoiChieu: Date | null;
    danhGia: number | null;
    hot: boolean | null;
    dangChieu: boolean | null;
    sapChieu: boolean | null;
    bannerUpload: Express.Multer.File | null;
}

export class formDataPhimUpdate {
    maPhim: number | null;
    tenPhim: string | null;
    trailer: string | null;
    hinhAnhUpload: Express.Multer.File | null;
    moTa: string | null;
    ngayKhoiChieu: Date | null;
    danhGia: number | null;
    hot: boolean | null;
    dangChieu: boolean | null;
    sapChieu: boolean | null;
    bannerUpload: Express.Multer.File | null;
}