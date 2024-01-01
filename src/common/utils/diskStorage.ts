import { Request } from 'express';
import { DiskStorageOptions, StorageEngine } from 'multer';
import { extname } from 'path';
import { diskStorage } from 'multer';

export function defaultMulterOptions(stroagePth: string) {
  return diskStorage({
    /**
     * @description 单文件 diskStorage
     * If no destination is given, the operating system's default directory for temporary files is used.
     * @export
     * @param {Request} req
     * @param {Express.Multer.File} file
     * @param {*} cb
     */
    destination: (req: Request, file: Express.Multer.File, cb: any) => {
      cb(null, stroagePth);
    },

    /**
     * @description 单文件 filename
     * If no filename is given, each file will be given a random name that doesn't include any file extension.
     * Note: Multer will not append any file extension for you, your function should return a filename complete with an file extension.
     * @param {Request} req
     * @param {Express.Multer.File} file
     * @param {*} cb
     */
    filename: (req: Request, file: Express.Multer.File, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      let storageFileName =
        file.fieldname + '-' + uniqueSuffix + extname(file.originalname);
      console.log(storageFileName);
      cb(null, storageFileName);
    },
  });
}
