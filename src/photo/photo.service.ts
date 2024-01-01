import { Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { ModuleRef } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable({ scope: Scope.DEFAULT })
export class PhotoService implements OnModuleInit {
  constructor(private readonly moduleRef: ModuleRef) {}

  /**
   * @description Illstrating moduleRef
   * @see https://docs.nestjs.com/fundamentals/module-ref
   * @memberof PhotoService
   */
  onModuleInit() {
    const service = this.moduleRef.get(CACHE_MANAGER);
    console.log(service.get('time'));
  }

  create(createPhotoDto: CreatePhotoDto) {
    return 'This action adds a new photo';
  }

  findAll() {
    return `This action returns all photo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} photo`;
  }

  update(id: number, updatePhotoDto: UpdatePhotoDto) {
    return `This action updates a #${id} photo`;
  }

  remove(id: number) {
    return `This action removes a #${id} photo`;
  }
}
