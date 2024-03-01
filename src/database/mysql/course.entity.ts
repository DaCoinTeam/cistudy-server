import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import { VerifyStatus } from "@common"
import { PostEntity } from "./post.entity"
import { EnrolledInfoEntity } from "./enrolled-info.entity"
import { SectionEntity } from "./section.entity"
import { UserEntity } from "./user.entity"
import { CourseTargetEntity } from "./course-target.entity"

interface CourseIncludes {
  time: number;
}

@ObjectType()
@Entity("course")
export class CourseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
      courseId: string

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 1000, nullable: true })
      title: string

  @Field(() => ID, { nullable: true })
  @Column({
      type: "uuid",
      length: 36,
      default: null,
  })
      thumbnailId: string

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 5000, nullable: true })
      description: string

  @Field(() => ID)
  @Column({ type: "uuid", length: 36 })
      creatorId: string

  @Field(() => Float, { defaultValue: 0 })
  @Column({ type: "float", default: 0 })
      price: number

  @Field(() => VerifyStatus, { nullable: true })
  @Column({ type: "enum", enum: VerifyStatus, default: null })
      verifyStatus: VerifyStatus

  @Field(() => Boolean, { defaultValue: true })
  @Column({ default: true })
      isDraft: boolean

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.courses)
  @JoinColumn({ name: "creatorId" })
      creator: UserEntity

  @Field(() => Boolean, { defaultValue: false })
  @Column({ default: false })
      isDeleted: boolean

  @Field(() => ID, { nullable: true })
  @Column({ type: "uuid", length: 36, default: null })
      previewVideoId: string

  @Field(() => String, { nullable: true })
  @Column({ type: "json", default: null })
      includes: CourseIncludes

  @Field(() => Date)
  @CreateDateColumn()
      createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
      updatedAt: Date

  @Field(() => [CourseTargetEntity], { nullable: true })
  @OneToMany(() => CourseTargetEntity, (courseTarget) => courseTarget.course)
      courseTargets: Array<CourseTargetEntity>

  @OneToMany(() => PostEntity, (post) => post.course)
      posts: Array<PostEntity>

  @OneToMany(() => EnrolledInfoEntity, (enrolled) => enrolled.course)
      enrolledInfos: EnrolledInfoEntity[]

  @Field(() => [SectionEntity])
  @OneToMany(() => SectionEntity, (section) => section.course, {
      onDelete: "CASCADE",
  })
      sections: SectionEntity[]
}
