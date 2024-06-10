import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn
} from 'typeorm';
import { UserEntity } from './user.entity';
import { SectionEntity } from './section.entity';
import { CourseEntity } from './course.entity';
import { LectureEntity } from './lecture.entity';

@ObjectType()
@Entity("user-progress")
export class UserProgressEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    userProgressId: string;

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    courseId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    sectionId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    lectureId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    userId: string

    @Field(() => Boolean, { defaultValue: false })
    @Column({ type: "boolean", default: false })
    isCompleted: Boolean;

    @Field(() => CourseEntity)
    @ManyToOne(() => CourseEntity, (course) => course.progresses)
    @JoinColumn({ name: "courseId" })
    course: CourseEntity

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.courseProgresses)
    @JoinColumn({ name: "userId" })
    user: UserEntity;

    @Field(() => SectionEntity)
    @ManyToOne(() => SectionEntity, (section) => section.userProgresses, { nullable: true })
    @JoinColumn({ name: "sectionId" })
    section: SectionEntity;

    @Field(() => LectureEntity)
    @ManyToOne(() => LectureEntity, (lecture) => lecture.userProgresses, { nullable: true })
    @JoinColumn({ name: "lectureId" })
    lecture: LectureEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
