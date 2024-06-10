import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"
import { LectureEntity } from "./lecture.entity"
import { CourseEntity } from "./course.entity"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { UserProgressEntity } from "./user-progress.entity"

@ObjectType()
@Entity("section")
export class SectionEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    sectionId: string

    @Field(() => String)
    @Column({ type: "varchar", length: 200 })
    title: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    courseId: string

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => CourseEntity)
    @ManyToOne(() => CourseEntity, (course) => course.sections)
    @JoinColumn({ name: "courseId" })
    course: CourseEntity

    @Field(() => [LectureEntity])
    @OneToMany(() => LectureEntity, (video) => video.section, { cascade: true })
    lectures: Array<LectureEntity>

    @Field(() => [UserProgressEntity])
    @OneToMany(() => UserProgressEntity, (userProgress) => userProgress.section)
    userProgresses: Array<UserProgressEntity>
}
