import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  HttpCode,
  Header,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  ParseBoolPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/auth.decoreator';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { ERole } from 'src/common/enums/role.enum';

@Controller('users')
@Roles([ERole.All])
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    console.log(
      'controller get environment variables',
      this.configService.get<string>('TEST_KEY'),
      this.configService.get<string>('None', 'defaultValue'),
      this.configService.get<number>('database.port'),
    );
  }

  @Post('testException')
  testException() {
    throw new HttpException('testException', HttpStatus.BAD_REQUEST, {
      cause: 'test',
      description: 'test',
    });
  }

  @Post('testRedirect')
  @HttpCode(302)
  @Header('custom-redirect', 'true')
  testRedirect() {
    return {
      url: 'http://www.baidu.com',
    };
  }

  @Public()
  @Get('builtInPipe')
  builtInPipe(
    @Query('age', new ParseIntPipe()) age: Request['query'],
    @Query(
      'valid',
      new DefaultValuePipe(false),
      new ParseBoolPipe({
        optional: false,
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    valid: Request['query'],
  ) {
    console.log(typeof age);
    console.log(age, valid);
    return 'builtInPipe';
  }

  /**
   * Using this built-in method, when a request handler returns a JavaScript object or array,
   * it will automatically be serialized to JSON.
   */
  @Post('createOne')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('createMany')
  createMany(@Body() createUserDtos: CreateUserDto[]) {
    return this.usersService.createMany(createUserDtos);
  }

  // test built-in HTTPModule, but remember to integrate @nest/axios & axios at the begining
  @Get('testHTTPModule')
  @Public()
  async testHTTPModule() {
    return await this.usersService.testHTTPModule();
  }

  @Get()
  @Public()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('delMany')
  delMany(@Body() info: { ids: number[] }) {
    return this.usersService.delMany(info.ids);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.usersService.softDelete2(+id);
  }

  @Roles([ERole.Admin])
  @Post('clear')
  clear() {
    // This action will truncate the indicated table.
    return this.usersService.clear();
  }
}
