import { AuthEmptyDataInput, AuthInput, OptionsOnly } from "@common"
import { Field, ID, InputType, Int } from "@nestjs/graphql"


@InputType()
export class FindManySelfCreatedCoursesInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManySelfCreatedCoursesInputData implements OptionsOnly<FindManySelfCreatedCoursesInputOptions>{
    @Field(() => FindManySelfCreatedCoursesInputOptions, { nullable: true })
        options?: FindManySelfCreatedCoursesInputOptions
}

export class FindManySelfCreatedCoursesInput
implements AuthInput<FindManySelfCreatedCoursesInputData>
{
    accountId: string
    data: FindManySelfCreatedCoursesInputData
}

export class FindManySelfCreatedCoursesMetadataInput implements AuthEmptyDataInput {
    accountId: string
}


@InputType()
export class FindManyEnrolledCoursesInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManyEnrolledCoursesInputData implements OptionsOnly<FindManyEnrolledCoursesInputOptions> {
    @Field(() => FindManyEnrolledCoursesInputOptions, { nullable: true })
        options?: FindManyEnrolledCoursesInputOptions
}

export class FindManyEnrolledCoursesInput
implements AuthInput<FindManyEnrolledCoursesInputData>
{   
    accountId: string
    data: FindManyEnrolledCoursesInputData
}

export class GenerateReportInput implements AuthEmptyDataInput {
    accountId: string  
}

@InputType()
export class FindManySubmittedReportsInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManyTransactionsInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManyTransactionsInputData implements OptionsOnly<FindManyTransactionsInputOptions> {
    @Field(() => FindManyTransactionsInputOptions, { nullable: true })
        options?: FindManyTransactionsInputOptions
}

export class FindManyTransactionsInput
implements AuthInput<FindManyTransactionsInputData>
{
    accountId: string
    data: FindManyTransactionsInputData
}

@InputType()
export class FindManyReceivedNotificationsInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManyReceivedNotificationsInputData implements OptionsOnly<FindManyReceivedNotificationsInputOptions>{
    @Field(() => FindManyReceivedNotificationsInputOptions, { nullable: true })
        options?: FindManyReceivedNotificationsInputOptions
}

export class FindManyReceivedNotificationsInput implements AuthInput<FindManyReceivedNotificationsInputData>{
    accountId: string
    data: FindManyReceivedNotificationsInputData
}

@InputType()
export class FindOneCertificateInputData {
    @Field(() => ID)
        certificateId : string
}

export class FindOneCertificateInput implements AuthInput<FindOneCertificateInputData> {
    accountId: string
    data: FindOneCertificateInputData
}