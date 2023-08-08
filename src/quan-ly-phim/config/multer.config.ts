import { diskStorage } from 'multer';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, callback) => {
        if (file.fieldname === 'bannerUpload') {
          callback(null, process.cwd() + "/public/banner");
        } else if (file.fieldname === 'hinhAnhUpload') {
          callback(null, process.cwd() + "/public/img");
        }
    },
    filename: (req,file,callback) => {
        let date = new Date();
        callback(null, date.getTime() + "_" + file.originalname);
    },
  }),
};

export const multerConfig2 = {
  storage: diskStorage({
    destination: (req, file, callback) => {
        if (file.fieldname === 'bannerUpload') {
          callback(null, process.cwd() + "/public/banner");
        } else if (file.fieldname === 'hinhAnhUpload') {
          callback(null, process.cwd() + "/public/img");
        }
    },
    filename: (req,file,callback) => {
        let date = new Date();
        callback(null, date.getTime() + "_" + file.originalname);
    },
  }),
};