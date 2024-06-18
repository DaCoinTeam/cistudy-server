import { AuthInput, Input, OptionsOnly, ParamsOnly, ParamsWithOptions } from "@common"
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
        followerId?: string
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
export class FindManyUserReviewsInputParams {
    @Field(() => ID)
    accountId: string
}

@InputType()
export class FindManyUserReviewsInputOptions {
    @Field(() => Int, { nullable: true })
    take?: number
    @Field(() => Int, { nullable: true })
    skip?: number
}

@InputType()
export class FindManyUserReviewsInputData implements ParamsWithOptions<FindManyUserReviewsInputParams, FindManyUserReviewsInputOptions> {
    @Field(() => FindManyUserReviewsInputParams)
    params: FindManyUserReviewsInputParams
    @Field(() => FindManyUserReviewsInputOptions, { nullable: true })
    @IsOptional()
    options?: FindManyUserReviewsInputOptions
}

export class FindManyUserReviewsInput implements Input<FindManyUserReviewsInputData> {
    data: FindManyUserReviewsInputData
}

