import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import { CourseEntity } from "./course.entity"

@ObjectType()
@Entity("course_target")
export class CourseTargetEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
      courseTargetId: string

  @Field(() => String)
  @Column({ type: "varchar", length: 200 })
      content: string

  @Field(() => Float)
  @Column({ type: "float", default: 0 })
      position: number

  @Field(() => Date)
  @CreateDateColumn()
      createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
      updatedAt: Date

  @Field(() => ID)
  @Column({ type: "uuid", length: 36 })
      courseId: string

  @Field(() => CourseEntity)
  @ManyToOne(() => CourseEntity, (course) => course.courseTargets)
  @JoinColumn({ name: "courseId" })
      course: CourseEntity
}
