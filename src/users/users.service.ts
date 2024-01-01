import { HttpException, Inject, Injectable, Scope } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(
    // dynamic module testing
    @Inject('DYNAMIC_OPTIONS') private options: Record<string, unknown>,
    // typeorm repository
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    // typeorm dataSource
    private readonly dataSource: DataSource,
    // httpService
    private readonly httpService: HttpService,
  ) {
    console.log('dynamic service get dynamic options', options);
  }

  /**
   * @description 单个增加
   * @param {CreateUserDto} createUserDto
   * @returns {*}  {Promise<UserEntity>}
   * @memberof UsersService
   */
  create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.save(createUserDto);
  }

  /**
   * @description 批量增加
   * @param {CreateUserDto[]} createUserDtos
   * @memberof UsersService
   */
  async createMany(createUserDtos: CreateUserDto[]) {
    await this.dataSource.transaction(
      async (transactionManager: EntityManager) => {
        let userEntities = createUserDtos.map((userDto) =>
          transactionManager.create(UserEntity, userDto),
        );
        await transactionManager.save(userEntities);
      },
    );
  }

  /**
   * @description 查询所有
   * @returns {*}  {Promise<UserEntity[]>}
   * @memberof UsersService
   */
  findAll(): Promise<UserEntity[]> {
    return this.userRepository.findBy({
      isActive: true,
    });
  }

  /**
   * @description 查询单个
   * @param {number} id
   * @returns {*}  {Promise<UserEntity>}
   * @memberof UsersService
   */
  findOne(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        id,
      },
      cache: true,
    });
  }

  findByAccount(
    firstName: string,
    lastName: string,
    pwd: string,
  ): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        firstName,
        lastName,
        pwd,
        isActive: true,
      },
      cache: true,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async softDelete(id: number) {
    await this.userRepository.softDelete(id);
  }

  async softDelete2(id: number) {
    await this.userRepository.softDelete(id);
    return this.userRepository.update(id, {
      isActive: false,
    });
  }

  async delMany(ids: number[]) {
    await this.userRepository.softDelete(ids);
    return this.userRepository.update(ids, {
      isActive: false,
    });
  }

  clear() {
    return this.userRepository.clear();
  }

  /**
   * Demonstrating HTTPModule
   * @see https://docs.nestjs.com/techniques/http-module
   */
  async testHTTPModule() {
    const { data } = await firstValueFrom(
      this.httpService.get<UserEntity[]>('http://localhost:3000/v1/users').pipe(
        catchError((error: any) => {
          console.error(error);
          throw error;
        }),
      ),
    );
    return data;
  }
}
