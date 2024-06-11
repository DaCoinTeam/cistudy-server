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
import { UserEntity } from './user.entity';
import { LectureEntity } from './lecture.entity';

@ObjectType()
@Entity("progress")
export class ProgressEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    progressId: string;

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    lectureId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    userId: string

    @Field(() => Boolean, { defaultValue: false })
    @Column({ type: "boolean", default: false })
    isCompleted: Boolean;

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.courseProgresses, {onDelete: "CASCADE"})
    @JoinColumn({ name: "userId" })
    user: UserEntity;

    @Field(() => LectureEntity)
    @ManyToOne(() => LectureEntity, (lecture) => lecture.userProgresses, {onDelete: "CASCADE"} )
    @JoinColumn({ name: "lectureId" })
    lecture: LectureEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
