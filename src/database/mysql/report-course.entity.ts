import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn} from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { CourseEntity } from "./course.entity"
import { AccountEntity } from "./account.entity"
import { ReportProcessStatus } from "@common"

@ObjectType()
@Entity("report-course")
export class ReportCourseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        reportCourseId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        reporterAccountId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        reportedCourseId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 200, nullable: true })
        description: string

    @Field(() => String)
    @Column({ type: "enum", enum: ReportProcessStatus, default: ReportProcessStatus.Processing })
        processStatus: ReportProcessStatus

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 2000, nullable: true })
        processNote: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (course) => course.courseReview, { nullable: true })
    @JoinColumn({ name: "reporterAccountId" })
        reporterAccount: AccountEntity

    @Field(() => CourseEntity)
    @ManyToOne(() => CourseEntity, (course) => course.courseReports, { nullable: true , onDelete: "CASCADE"})
    @JoinColumn({ name: "reportedCourseId" })
        reportedCourse: CourseEntity
}

