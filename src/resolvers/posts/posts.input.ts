import { AuthInput, ParamsOnly, ParamsWithOptions } from "@common"
import { Field, ID, InputType, Int } from "@nestjs/graphql"
import { IsInt } from "class-validator"

@InputType()
export class FindOnePostInputParams {
  @Field(() => ID)
      postId: string
}

@InputType()
export class FindOnePostInputData implements ParamsOnly<FindOnePostInputParams> {
  @Field(() => FindOnePostInputParams)
      params: FindOnePostInputParams
}

export class FindOnePostInput implements AuthInput<FindOnePostInputData> {
    userId: string
    data: FindOnePostInputData
}

@InputType()
export class FindOnePostCommentInputParams {
  @Field(() => ID)
      postCommentId: string
}

@InputType()
export class FindOnePostCommentInputData implements ParamsOnly<FindOnePostCommentInputParams> {
  @Field(() => FindOnePostCommentInputParams)
      params: FindOnePostCommentInputParams
}

export class FindOnePostCommentInput
implements AuthInput<FindOnePostCommentInputData>
{
    userId: string
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
