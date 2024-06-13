import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"
import { LessonEntity } from "./lesson.entity"
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

  @Field(() => ID)
  @Column({ name: "lessonId", type: "uuid", length: 36 })
      lessonId: string

  @Field(() => Date)
  @CreateDateColumn()
      createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
      updatedAt: Date

  @Field(() => LessonEntity)
  @ManyToOne(() => LessonEntity, (lesson) => lesson.resources, { onDelete: "CASCADE" })
  @JoinColumn({ name: "lessonId" })
      lesson: LessonEntity
}
