import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"
import { CourseEntity } from "./course.entity"

@ObjectType()
@Entity("course-configuration")
export class CourseConfigurationEntity {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn("uuid")
      courseConfigurationId: string

  @Field(() => Float, { defaultValue: 10, nullable: true })
  @Column({ type: "float", default: 10 })
      earn: number

  @Field(() => Float, { defaultValue: 30, nullable: true })
  @Column({ type: "float", default: 30 })
      completed: number

  @Field(() => Date)
  @CreateDateColumn()
      createdAt: Date

  @Field(() => ID, { nullable: true })
  @Column({ type: "uuid", length: 36 })
      courseId: string

  @Field(() => Date)
  @UpdateDateColumn()
      updatedAt: Date

  @Field(() => CourseEntity, { nullable: true })
  @ManyToOne(() => CourseEntity, (course) => course.courseConfiguration, {
      onDelete: "CASCADE",
  })
  @JoinColumn({ name: "courseId" })
      course: CourseEntity
}
