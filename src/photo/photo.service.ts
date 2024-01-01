import { Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { ModuleRef } from '@nestjs/core';

@Injectable({ scope: Scope.DEFAULT })
export class PhotoService implements OnModuleInit {
  constructor(private readonly moduleRef: ModuleRef) {}

  /**
   * @description Illstrating moduleRef
   * @see https://docs.nestjs.com/fundamentals/module-ref
   * @memberof PhotoService
   */
  onModuleInit() {
    // This method retrieves a provider, controller, or injectable (e.g., guard, interceptor, etc.) that exists (has been instantiated) in the current module using its injection token/class name.
    const service = this.moduleRef.get(PhotoService);
    service.testServiceMethod()
  }

  testServiceMethod(){
    console.log('moduleRef accessed');
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
