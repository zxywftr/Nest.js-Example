import {
  Controller,
  FileTypeValidator,
  Get,
  Header,
  HttpStatus,
  Inject,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request, Response } from 'express';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller()
@Public()
export class AppController {
  // 是否缓存过值
  private settled: boolean = false;

  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * @description cache machenism testing
   * @see https://docs.nestjs.com/techniques/caching
   * @returns {*}  {Promise<number>}
   * @memberof AppController
   */
  @Get('testCahe')
  async testGlobalCacheManager(): Promise<number> {
    if (!this.settled) {
      await this.cacheManager.set('time', Date.now());
      this.settled = true;
    }
    // The reuslt will be null if the preservation time is out.
    return await this.cacheManager.get('time');
  }

  /**
   * @description test getting cookies from Request
   * @param {Request} request
   * @returns {*}
   * @memberof AppController
   */
  @Get('testCookie')
  testCookie(@Req() request: Request): Request['cookies'] {
    return request.cookies;
  }

  /**
   * @description single file uploading
   * @see https://docs.nestjs.com/techniques/file-upload
   * @param {Express.Multer.File} singleFile
   * @memberof AppController
   */
  @Post('testSingleUpload')
  @UseInterceptors(FileInterceptor('fileField'))
  testSingleUpload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Checks if a given file's size is less than the provided value (measured in bytes)
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 1024,
            message: '文件尺寸过大',
          }),
          //  Checks if a given file's mime-type matches the given value.
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    singleFile: Express.Multer.File,
  ) {
    console.log(singleFile);
  }

  /**
   * @description multi-files uploading
   * @see https://docs.nestjs.com/techniques/file-upload
   * @param {{
   *       avatar?: Express.Multer.File[];
   *       background?: Express.Multer.File[];
   *     }} files
   * @memberof AppController
   */
  @Post('testMutiUpload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'background', maxCount: 1 },
      ],
      {
        limits: {
          /** For multipart forms, the max file size (in bytes)(Default: Infinity) */
          fileSize: 1024 * 1024 * 1024,
        },
      },
    ),
  )
  testMutiUpload(
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
  ) {
    console.log(files);
  }

  /**
   * @description Demonstrage streamable
   * @see https://docs.nestjs.com/techniques/streaming-files
   * @param {Response} res
   * @returns {*}  {StreamableFile}
   * @memberof AppController
   */
  @Get('streamableFile')
  @Header('Content-Type', 'text/javascript')
  streamableFile(@Res({ passthrough: true }) res: Response): StreamableFile {
    const fileStream = createReadStream(join(__dirname, './main.js'));
    // The default content type is application/octet-stream, if you need to customize the response you can use the res.set method or the @Header() decorator
    return new StreamableFile(fileStream);
  }
}
