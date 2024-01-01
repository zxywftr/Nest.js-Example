import { Reflector } from '@nestjs/core';
import { ERole } from '../enums/role.enum';

export const Roles = Reflector.createDecorator<ERole[]>();
