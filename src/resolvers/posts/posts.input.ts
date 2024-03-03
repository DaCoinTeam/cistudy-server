import { AuthInput } from "@common"
import { Field, ID, InputType, Int } from "@nestjs/graphql"
import { IsInt } from "class-validator"

@InputType()
export class FindOnePostInputData {
    @Field(() => ID)
        postId: string
}

@InputType()
export class FindOnePostInput implements AuthInput<FindOnePostInputData> {
    @Field(() => ID)
        userId: string
    @Field(() => FindOnePostInputData)
        data: FindOnePostInputData
}

@InputType()
export class FindOnePostCommentInputData {
    @Field(() => ID)
        postCommentId: string
}

@InputType()
export class FindOnePostCommentInput
implements AuthInput<FindOnePostCommentInputData>
{
    @Field(() => ID)
        userId: string
    @Field(() => FindOnePostCommentInputData)
        data: FindOnePostCommentInputData
}

@InputType()
export class FindManyPostsInputOptions {
    @Field(() => Int, { nullable: true })
    @IsInt()
        take?: number
    @Field(() => Int, { nullable: true })
    @IsInt()
        skip?: number
}

@InputType()
export class FindManyPostsInputData {
    @Field(() => String)
        courseId: string
    @Field(() => FindManyPostsInputOptions, { nullable: true })
        options?: FindManyPostsInputOptions
}

export class FindManyPostsInput implements AuthInput<FindManyPostsInputData> {
    userId: string
    data: FindManyPostsInputData
}

@InputType()
export class FindManyPostsCommentInputOptions {
    @Field(() => Int, { nullable: true })
    @IsInt()
        take?: number
    @Field(() => Int, { nullable: true })
    @IsInt()
        skip?: number
}

@InputType()
export class FindManyPostCommentsInputData {
    @Field(() => ID)
        postId: string
    @Field(() => FindManyPostsCommentInputOptions, { nullable: true })
        options?: FindManyPostsCommentInputOptions
}

@InputType()
export class FindManyPostsMetadataInputData {
    @Field(() => ID)
        postId: string
}

@InputType()
export class FindManyPostsMetadataInput implements AuthInput<FindManyPostsMetadataInputData> {
    @Field(() => ID)
        userId: string
    @Field(() => FindManyPostsMetadataInputData)
        data: FindManyPostsMetadataInputData
}

@InputType()
export class FindManyPostCommentsMetadataInputData {
    @Field(() => ID)
        postId: string
}

@InputType()
export class FindManyPostCommentsMetadataInput implements AuthInput<FindManyPostCommentsMetadataInputData> {
    @Field(() => ID)
        userId: string
    @Field(() => FindManyPostCommentsMetadataInputData)
        data: FindManyPostCommentsMetadataInputData
}

export class FindManyPostCommentsInput
implements AuthInput<FindManyPostCommentsInputData>
{
    userId: string
    data: FindManyPostCommentsInputData
}
