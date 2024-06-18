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
import { AccountEntity } from './account.entity';
import { LessonEntity } from './lesson.entity';

@ObjectType()
@Entity("progress")
export class ProgressEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    progressId: string;

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    lessonId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    accountId: string

    @Field(() => Boolean, { defaultValue: false })
    @Column({ type: "boolean", default: false })
    isCompleted: Boolean;

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.courseProgresses, {onDelete: "CASCADE"})
    @JoinColumn({ name: "accountId" })
    account: AccountEntity;

    @Field(() => LessonEntity)
    @ManyToOne(() => LessonEntity, (lesson) => lesson.accountProgresses, {onDelete: "CASCADE"} )
    @JoinColumn({ name: "lessonId" })
    lesson: LessonEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
