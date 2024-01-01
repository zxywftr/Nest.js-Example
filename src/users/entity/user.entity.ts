import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { PhotoEntity } from '../../photo/entity/photo.entity';
import { ERole } from 'src/common/enums/role.enum';
import { Exclude, Type } from 'class-transformer';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * @see {@link https://typeorm.io/decorator-reference#column | @Column()}
   */
  @Column({
    type: 'varchar',
    // Column name in the database table. By default, the column name is generated from the name of the property. You can change it by specifying your own name.
    name: 'firstName',
    length: 150,
    // By default column is nullable: false.
    nullable: false,
    // Adds database-level column's DEFAULT value.
    default: 'defaultFirstName',
    // Marks column as unique column
    unique: false,
  })
  firstName: string;

  @Column({
    nullable: true,
    default: 'defaultLastName',
  })
  lastName: string;

  @Exclude()
  @Column({ default: true })
  isActive: boolean;

  // Skipping specific properties
  @Exclude()
  @Column({ default: 'xuanyu' })
  pwd: string;

  @Column({ default: ERole.All })
  user: string;

  // Сonverting date strings into Date objects
  @Type(() => Date)
  @CreateDateColumn()
  createDate: Date;

  @Type(() => Date)
  @UpdateDateColumn()
  updateDateColumn: Date;

  @Type(() => Date)
  @DeleteDateColumn()
  deleteDateColumn: Date;

  @VersionColumn()
  versionColumn: number;

  @OneToMany((type) => PhotoEntity, (photoEntity) => photoEntity.user)
  photos: PhotoEntity[];
}
