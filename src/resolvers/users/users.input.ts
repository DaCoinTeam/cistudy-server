import { AuthInput, Input, OptionsOnly, ParamsOnly, ParamsWithOptions } from "@common"
import { Field, ID, InputType, Int } from "@nestjs/graphql"
import { IsOptional, IsUUID } from "class-validator"


@InputType()
export class FindOneUserInputParams {
    @Field(() => ID)
    @IsUUID()
        userId: string
}

@InputType()
export class FindOneUserInputOptions {
    @Field(() => ID, { nullable: true })
    @IsOptional()
        followerId?: string
}

@InputType()
export class FindOneUserInputData implements ParamsWithOptions<FindOneUserInputParams, FindOneUserInputOptions> {
    @Field(() => FindOneUserInputParams)
        params: FindOneUserInputParams
    @Field(() => FindOneUserInputOptions, { nullable: true })
    @IsOptional()
        options?: FindOneUserInputOptions
}

export class FindOneUserInput implements Input<FindOneUserInputData> {
    data: FindOneUserInputData
}


@InputType()
export class FindManyFollowersInputParams {
    @Field(() => ID)
    @IsUUID()
        userId: string
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
        userId: string
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
export class FindManyUsersInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
    @Field(() => String, { nullable: true })
        searchValue?: string
}

@InputType()
export class FindManyUsersInputData implements OptionsOnly<FindManyUsersInputOptions> {
    @Field(() => FindManyUsersInputOptions, { nullable: true })
        options: FindManyUsersInputOptions
}

export class FindManyUsersInput
implements AuthInput<FindManyUsersInputData>
{
    userId: string
    data: FindManyUsersInputData
}

