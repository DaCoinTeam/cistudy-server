import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import { AccountGradeEntity } from "./account-grade.entity"
import { AccountEntity } from "./account.entity"
import { CourseEntity } from "./course.entity"

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
    @ManyToOne(() => CourseEntity, (course) => course.enrolledInfos, {onDelete: "CASCADE"})
    @JoinColumn({ name: "courseId" })
        course: CourseEntity

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.enrolledInfos)
    @JoinColumn({ name: "accountId" })
        account: AccountEntity

    @Field(() => AccountGradeEntity)
    @OneToMany(() => AccountGradeEntity, (accountGrade) => accountGrade.enrolledInfo)
        accountGrade: AccountGradeEntity
}
