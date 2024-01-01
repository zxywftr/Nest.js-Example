import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ERole } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  pwd: string;

  @IsNotEmpty()
  @IsString()
  roles: ERole;
}
