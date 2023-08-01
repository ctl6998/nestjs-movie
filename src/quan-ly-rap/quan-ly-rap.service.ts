import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class QuanLyRapService {

    prisma = new PrismaClient();

    async findAll() {
        let data = await this.prisma.heThongRap.findMany();
        return data;
    }

    async findOne(maHeThongRap: number) {
        let data = await this.prisma.heThongRap.findFirst({
            where: {
                ma_he_thong_rap: maHeThongRap
            }
        })
        return data;
    }

    async findAllCumRap(maHeThongRap: number) {
        let data = await this.prisma.cumRap.findMany({
            where: {
                ma_he_thong_rap: maHeThongRap
            }
        })
        return data;
    }
    
    async findAllLichChieu(maHeThongRap: number) {
        let data = await this.prisma.lichChieu.findMany({
            where: {
              RapPhim: {
                CumRap: {
                  ma_he_thong_rap: maHeThongRap,
                },
              },
            },
            include: {
              RapPhim: {
                include: {
                  CumRap: {
                    where: {
                      ma_he_thong_rap: maHeThongRap,
                    },
                  },
                },
              },
            },
        });
        return data;
    }

    async findAllLichChieuPhim(maPhim: number) {
        let data = await this.prisma.lichChieu.findMany({
            where: {
                ma_phim: maPhim
            },
            include: {
                RapPhim: true
            }
        })
        return data;
    }
}
