import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm"
import { AccountEntity } from "./account.entity"
import { CourseEntity } from "./course.entity"
import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql"
import { ProgressEntity } from "./progress.entity"

@ObjectType()
@Entity("enrolled_info")
export class EnrolledInfoEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    enrolledInfoId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    accountId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    courseId: string

    @Field(() => Date, { nullable: true })
    @Column({ type: "datetime", nullable: true })
    endDate: Date

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => Boolean)
    @Column({ type: "boolean", default: true })
    enrolled: boolean

    @Field(() => Float, { nullable: true })
    @Column({
        type: "decimal",
        precision: 10,
        scale: 5,
        default: 0,
    })
    priceAtEnrolled: number

    @Field(() => CourseEntity)
    @ManyToOne(() => CourseEntity, (course) => course.enrolledInfos)
    @JoinColumn({ name: "courseId" })
    course: CourseEntity

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.enrolledInfos)
    @JoinColumn({ name: "accountId" })
    account: AccountEntity

    @Field(() => [ProgressEntity])
    @OneToMany(() => ProgressEntity, (courseProgress) => courseProgress.enrolledInfo)
    courseProgress: Array<ProgressEntity>

}
