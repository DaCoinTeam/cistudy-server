import { ReportProcessStatus, ReportType } from "@common"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { AccountEntity } from "../mysql/account.entity"
import { CourseEntity } from "../mysql/course.entity"
import { PostEntity } from "../mysql/post.entity"
import { PostCommentEntity } from "../mysql/post-comment.entity"


@ObjectType()
export class ReportModel {
    @Field(() => ID, { nullable: true })
        reportId: string
    @Field(() => String, { nullable: true })
        type: ReportType
    @Field(() => AccountEntity, { nullable: true })
        reporterAccount: AccountEntity
    @Field(() => AccountEntity, { nullable: true })
        reportedAccount: AccountEntity
    @Field(() => CourseEntity, { nullable: true })
        reportedCourse: CourseEntity
    @Field(() => PostEntity, { nullable: true })
        reportedPost: PostEntity
    @Field(() => PostCommentEntity, { nullable: true })
        reportedPostComment: PostCommentEntity
    @Field(() => String, { nullable: true })
        description: string
    @Field(() => String, { nullable: true })
        processStatus: ReportProcessStatus
    @Field(() => String, { nullable: true })
        processNote: string
    @Field(() => Date, { nullable: true })
        createdAt: Date
    @Field(() => Date, { nullable: true })
        updatedAt: Date
}