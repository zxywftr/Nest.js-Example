import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { UserEntity } from "../../users/entity/user.entity"

@Entity()
export class PhotoEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    url: string

    @ManyToOne(() => UserEntity, (user) => user.photos)
    user: UserEntity
}