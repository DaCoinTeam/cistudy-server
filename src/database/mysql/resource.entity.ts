import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"
import { LectureEntity } from "./lecture.entity"
import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
@Entity("resource")
export class ResourceEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
      resourceId: string

  @Field(() => String)
  @Column({ type: "varchar", length: 200 })
      name: string

  @Field(() => String)
  @Column({ type: "varchar", length: 200 })
      fileId: string

  @Field(() => String)
  @Column({ name: "lectureId", type: "uuid", length: 36 })
      lectureId: string

  @Field(() => Date)
  @CreateDateColumn()
      createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
      updatedAt: Date

  @Field(() => LectureEntity)
  @ManyToOne(() => LectureEntity, (lecture) => lecture.resources, {
      onDelete: "CASCADE"
  })
  
  @JoinColumn({ name: "lectureId" })
      lecture: LectureEntity
}
