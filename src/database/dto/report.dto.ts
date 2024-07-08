import { ReportProcessStatus, ReportType } from "@common"
import { Field, ID, ObjectType } from "@nestjs/graphql"


@ObjectType()
export class ReportModel {
    @Field(() => ID, { nullable: true })
        reportId: string
    @Field(() => String, { nullable: true })
        type: ReportType
    @Field(() => ID, { nullable: true })
        reporterAccountId: string
    @Field(() => ID, { nullable: true })
        reportContentId: string
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