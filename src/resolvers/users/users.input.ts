import { Input } from "@common"
import { Field, InputType, Int } from "@nestjs/graphql"
import { IsUUID } from "class-validator"

@InputType()
export class FindOneUserInputOptions {
    @Field(() => String)
    @IsUUID()
        followerId: string
}

@InputType()
export class FindOneUserInputData {
    @Field(() => String)
    @IsUUID()
        userId: string

    @Field(() => FindOneUserInputOptions, { nullable: true })
        options?: FindOneUserInputOptions
}

export class FindOneUserInput implements Input<FindOneUserInputData> {
    data: FindOneUserInputData
}

@InputType()
export class FindManyFollowersInputData {
    @Field(() => String)
    @IsUUID()
        userId: string
}

export class FindManyFollowersInput implements Input<FindManyFollowersInputData> {
    data: FindManyFollowersInputData
}

@InputType()
export class FindManyCreatedCoursesInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManyCreatedCoursesInputData {
    @Field(() => String)
    @IsUUID()
        userId: string
    @Field(() => FindManyCreatedCoursesInputOptions, { nullable: true})
        options?: FindManyCreatedCoursesInputOptions
}

export class FindManyCreatedCoursesInput
implements Input<FindManyCreatedCoursesInputData>
{
    data: FindManyCreatedCoursesInputData
}
