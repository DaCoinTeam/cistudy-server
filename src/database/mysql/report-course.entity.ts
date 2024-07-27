import { ReportProcessStatus } from "@common"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import { AccountEntity } from "./account.entity"
import { CourseEntity } from "./course.entity"

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
    @Column({ type: "varchar", length: 100, nullable: true })
        title: string

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

