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
import { PostEntity } from "./post.entity"

@ObjectType()
@Entity("report-post")
export class ReportPostEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        reportPostId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        reporterAccountId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        reportedPostId: string

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

    @Field(() => PostEntity)
    @ManyToOne(() => PostEntity, (post) => post.postReports, { nullable: true , onDelete: "CASCADE"})
    @JoinColumn({ name: "reportedPostId" })
        reportedPost: PostEntity
}

