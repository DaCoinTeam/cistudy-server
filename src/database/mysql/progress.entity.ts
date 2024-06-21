import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn
} from 'typeorm';
import { LessonEntity } from './lesson.entity';
import { EnrolledInfoEntity } from './enrolled-info.entity';

@ObjectType()
@Entity("progress")
export class ProgressEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    progressId: string;

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    enrolledInfoId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    lessonId: string

    @Field(() => Boolean, { defaultValue: false })
    @Column({ type: "boolean", default: false })
    isCompleted: Boolean;

    @Field(() => LessonEntity)
    @ManyToOne(() => LessonEntity, (lesson) => lesson.accountProgresses, {onDelete: "CASCADE"} )
    @JoinColumn({ name: "lessonId" })
    lesson: LessonEntity;

    @Field(() => EnrolledInfoEntity)
    @ManyToOne(() => EnrolledInfoEntity, (enrolledInfo) => enrolledInfo.courseProgress, {onDelete: "CASCADE"} )
    @JoinColumn({ name: "enrolledInfoId" })
    enrolledInfo: EnrolledInfoEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
