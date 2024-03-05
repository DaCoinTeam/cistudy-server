import { AuthInput, ParamsWithOptions } from "@common"
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
export class FindManyPostsInputParams {
  @Field(() => String)
      courseId: string
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
export class FindManyPostsInputData
implements
    ParamsWithOptions<FindManyPostsInputParams, FindManyPostsInputOptions>
{
  @Field(() => FindManyPostsInputParams)
      params: FindManyPostsInputParams
  @Field(() => FindManyPostsInputOptions, { nullable: true })
      options?: Partial<FindManyPostsInputOptions>
}

export class FindManyPostsInput implements AuthInput<FindManyPostsInputData> {
    userId: string
    data: FindManyPostsInputData
}

@InputType()
export class FindManyPostCommentsInputParams {
  @Field(() => String)
      postId: string
}

@InputType()
export class FindManyPostCommentsInputOptions {
  @Field(() => Int, { nullable: true })
  @IsInt()
      take?: number
  @Field(() => Int, { nullable: true })
  @IsInt()
      skip?: number
}

@InputType()
export class FindManyPostCommentsInputData
implements
    ParamsWithOptions<
      FindManyPostCommentsInputParams,
      FindManyPostCommentsInputOptions
    >
{
  @Field(() => FindManyPostCommentsInputParams)
      params: FindManyPostCommentsInputParams
  @Field(() => FindManyPostCommentsInputOptions, { nullable: true })
      options?: Partial<FindManyPostCommentsInputOptions>
}

export class FindManyPostCommentsInput
implements AuthInput<FindManyPostCommentsInputData>
{
    userId: string
    data: FindManyPostCommentsInputData
}

@InputType()
export class FindManyPostCommentRepliesInputParams {
  @Field(() => String)
      postCommentId: string
}

@InputType()
export class FindManyPostsCommentRepliesInputOptions {
  @Field(() => Int, { nullable: true })
  @IsInt()
      take?: number
  @Field(() => Int, { nullable: true })
  @IsInt()
      skip?: number
}

@InputType()
export class FindManyPostCommentRepliesInputData
implements
    ParamsWithOptions<
      FindManyPostCommentRepliesInputParams,
      FindManyPostsCommentRepliesInputOptions
    >
{
  @Field(() => FindManyPostCommentRepliesInputParams)
      params: FindManyPostCommentRepliesInputParams
  @Field(() => FindManyPostsCommentRepliesInputOptions, { nullable: true })
      options?: Partial<FindManyPostsCommentRepliesInputOptions>
}

export class FindManyPostCommentRepliesInput
implements AuthInput<FindManyPostCommentRepliesInputData>
{
    userId: string
    data: FindManyPostCommentRepliesInputData
}
