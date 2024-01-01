import { Reflector } from "@nestjs/core";

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = Reflector.createDecorator<typeof IS_PUBLIC_KEY>()