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
import { PostCommentEntity } from "./post-comment.entity"

@ObjectType()
@Entity("report-post-comment")
export class ReportPostCommentEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        reportPostCommentId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        accountId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        postCommentId: string

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

    @Field(() => PostCommentEntity)
    @ManyToOne(() => PostCommentEntity, (postComment) => postComment.postCommentReports, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "reportedPostCommentId" })
        reportedPostComment: PostCommentEntity
}
/*
report_id	UUID	PRIMARY KEY
reporter_id	UUID	NOT NULL, FOREIGN KEY REFERENCES Accounts(account_id)
report_type	ENUM	NOT NULL, values: 'COURSE', 'ACCOUNT', 'POST', 'COMMENT'
reported_id	UUID	NOT NULL
description	TEXT	
created_at	TIMESTAMP	NOT NULL, DEFAULT CURRENT_TIMESTAMP
updated_at	TIMESTAMP	NOT NULL, DEFAULT CURRENT_TIMESTAMP
*/
