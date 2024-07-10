import { AuthEmptyDataInput, AuthInput, OptionsOnly } from "@common"
import { Field, InputType, Int } from "@nestjs/graphql"


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
export class FindManySubmittedReportsInputData implements OptionsOnly<FindManySubmittedReportsInputOptions>{
    @Field(() => FindManySubmittedReportsInputOptions, { nullable: true })
        options?: FindManySubmittedReportsInputOptions
}

export class FindManySubmittedReportsInput implements AuthInput<FindManySubmittedReportsInputData> {
    accountId: string
    data : FindManySubmittedReportsInputData
}
