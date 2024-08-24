import { AuthEmptyDataInput, AuthInput, Input, OptionsOnly, ParamsOnly, ParamsWithOptions } from "@common"
import { Field, ID, InputType, Int } from "@nestjs/graphql"
import { IsOptional, IsUUID } from "class-validator"


@InputType()
export class FindOneAccountInputParams {
    @Field(() => ID)
    @IsUUID()
        accountId: string
}

@InputType()
export class FindOneAccountInputOptions {
    @Field(() => ID, { nullable: true })
    @IsOptional()
        followerId? : string
}

@InputType()
export class FindOneAccountInputData implements ParamsWithOptions<FindOneAccountInputParams, FindOneAccountInputOptions> {
    @Field(() => FindOneAccountInputParams)
        params: FindOneAccountInputParams
    @Field(() => FindOneAccountInputOptions, { nullable: true })
    @IsOptional()
        options?: FindOneAccountInputOptions
}

export class FindOneAccountInput implements Input<FindOneAccountInputData> {
    data: FindOneAccountInputData
}


@InputType()
export class FindManyFollowersInputParams {
    @Field(() => ID)
    @IsUUID()
        accountId: string
}

@InputType()
export class FindManyFollowersInputData implements ParamsOnly<FindManyFollowersInputParams> {
    @Field(() => FindManyFollowersInputParams)
        params: FindManyFollowersInputParams
}

export class FindManyFollowersInput implements Input<FindManyFollowersInputData> {
    data: FindManyFollowersInputData
}

@InputType()
export class FindManyCreatedCoursesInputParams {
    @Field(() => String)
    @IsUUID()
        accountId: string
}

@InputType()
export class FindManyCreatedCoursesInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManyCreatedCoursesInputData implements ParamsWithOptions<FindManyCreatedCoursesInputParams, FindManyCreatedCoursesInputOptions> {
    @Field(() => FindManyCreatedCoursesInputParams)
        params: FindManyCreatedCoursesInputParams
    @Field(() => FindManyCreatedCoursesInputOptions, { nullable: true })
        options?: FindManyCreatedCoursesInputOptions
}

export class FindManyCreatedCoursesInput
implements Input<FindManyCreatedCoursesInputData>
{
    data: FindManyCreatedCoursesInputData
}

@InputType()
export class FindManyAccountsInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
    @Field(() => String, { nullable: true })
        searchValue?: string
}

@InputType()
export class FindManyAdminTransactionsInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
    @Field(() => String, { nullable: true })
        searchValue?: string
}

@InputType()
export class FindManyAdminTransactionsInputData implements OptionsOnly<FindManyAdminTransactionsInputOptions> {
    @Field(() => FindManyAdminTransactionsInputOptions, { nullable: true })
        options: FindManyAdminTransactionsInputOptions
}

export class FindManyAdminTransactionsInput implements AuthInput<FindManyAdminTransactionsInputData> {
    accountId: string
    data: FindManyAdminTransactionsInputData
}


@InputType()
export class FindManyNotificationsInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
    @Field(() => String, { nullable: true })
        searchValue?: string
}

@InputType()
export class FindManyNotificationsInputData implements OptionsOnly<FindManyNotificationsInputOptions> {
    @Field(() => FindManyNotificationsInputOptions, { nullable: true })
        options: FindManyNotificationsInputOptions
}

export class FindManyNotificationsInput implements AuthInput<FindManyNotificationsInputData> {
    accountId: string
    data: FindManyNotificationsInputData
}

@InputType()
export class FindManyAccountsInputData implements OptionsOnly<FindManyAccountsInputOptions> {
    @Field(() => FindManyAccountsInputOptions, { nullable: true })
        options: FindManyAccountsInputOptions
}

export class FindManyAccountsInput
implements AuthInput<FindManyAccountsInputData>
{
    accountId: string
    data: FindManyAccountsInputData
}

@InputType()
export class FindManyAccountReviewsInputParams {
    @Field(() => ID)
        accountId: string
}

@InputType()
export class FindManyAccountReviewsInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManyAccountReviewsInputData implements ParamsWithOptions<FindManyAccountReviewsInputParams, FindManyAccountReviewsInputOptions> {
    @Field(() => FindManyAccountReviewsInputParams)
        params: FindManyAccountReviewsInputParams
    @Field(() => FindManyAccountReviewsInputOptions, { nullable: true })
    @IsOptional()
        options?: FindManyAccountReviewsInputOptions
}

export class FindManyAccountReviewsInput implements Input<FindManyAccountReviewsInputData> {
    data: FindManyAccountReviewsInputData
}

@InputType()
export class FindManyAccountReportsInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManyAccountReportsInputData implements OptionsOnly<FindManyAccountReportsInputOptions>{
    @Field(() => FindManyAccountReportsInputOptions, { nullable: true })
    @IsOptional()
        options?: FindManyAccountReportsInputOptions
}

export class FindManyAccountReportsInput implements AuthInput<FindManyAccountReportsInputData> {
    accountId: string
    data: FindManyAccountReportsInputData
}
@InputType()
export class FindManyPublishedCoursesInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}
@InputType()
export class FindManyPublishedCoursesInputData implements OptionsOnly<FindManyPublishedCoursesInputOptions>{
    @Field(() => FindManyPublishedCoursesInputOptions, { nullable: true })
    @IsOptional()
        options?: FindManyPublishedCoursesInputOptions
}

export class FindManyPublishedCoursesInput implements AuthInput<FindManyPublishedCoursesInputData> {
    accountId: string
    data: FindManyPublishedCoursesInputData
}

export class GetAdminAnalyticsInput implements AuthEmptyDataInput {
    accountId: string
}

@InputType()
export class FindOneAdminAccountInputParams {
    @Field(() => ID)
    @IsUUID()
        accountId: string
}

@InputType()
export class FindOneAdminAccountInputData implements ParamsOnly<FindOneAdminAccountInputParams> {
    @Field(() => FindOneAdminAccountInputParams, { nullable: true })
        params: FindOneAdminAccountInputParams
}

export class FindOneAdminAccountInput implements AuthInput<FindOneAdminAccountInputData> {
    accountId: string
    data: FindOneAdminAccountInputData
}

@InputType()
export class FindManyPendingInstructorInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}
@InputType()
export class FindManyPendingInstructorInputData implements OptionsOnly<FindManyPendingInstructorInputOptions>{
    @Field(() => FindManyPendingInstructorInputOptions, { nullable: true })
    @IsOptional()
        options?: FindManyPendingInstructorInputOptions
}

export class FindManyPendingInstructorInput implements AuthInput<FindManyPendingInstructorInputData> {
    accountId: string
    data: FindManyPendingInstructorInputData
}