import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"

import { LessonEntity } from "./lesson.entity"
import { AccountEntity } from "./account.entity"

@ObjectType()
@Entity("progress")
export class ProgressEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        progressId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        accountId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        lessonId: string

    @Field(() => Float, { nullable: true })
    @Column({ type: "float", default: 0 })
        completePercent: number
    
    @Field(() => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
        completeFirstWatch: boolean

    @Field(() => LessonEntity)
    @ManyToOne(() => LessonEntity, (lesson) => lesson.progresses )
    @JoinColumn({ name: "lessonId" })
        lesson: LessonEntity

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.courseProgress)
    @JoinColumn({ name: "accountId" })
        account: AccountEntity

    @CreateDateColumn()
        createdAt: Date

    @UpdateDateColumn()
        updatedAt: Date
}
