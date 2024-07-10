import { AuthInput, OptionsOnly, ParamsOnly, ParamsWithOptions } from "@common"
import { Field, ID, InputType, Int } from "@nestjs/graphql"
import { IsInt, IsOptional } from "class-validator"

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
    accountId: string
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
    accountId: string
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
    accountId: string
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
    accountId: string
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
    accountId: string
    data: FindManyPostCommentRepliesInputData
}

//
@InputType()
export class FindManyPostReportsInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManyPostReportsInputData implements OptionsOnly<FindManyPostReportsInputOptions>{
    @Field(() => FindManyPostReportsInputOptions, { nullable: true })
    @IsOptional()
        options?: FindManyPostReportsInputOptions
}

export class FindManyPostReportsInput implements AuthInput<FindManyPostReportsInputData> {
    accountId: string
    data: FindManyPostReportsInputData
}
//

@InputType()
export class FindManyPostCommentReportsInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManyPostCommentReportsInputData implements OptionsOnly<FindManyPostCommentReportsInputOptions>{
    @Field(() => FindManyPostCommentReportsInputOptions, { nullable: true })
    @IsOptional()
        options?: FindManyPostCommentReportsInputOptions
}

export class FindManyPostCommentReportsInput implements AuthInput<FindManyPostCommentReportsInputData> {
    accountId: string
    data: FindManyPostCommentReportsInputData
}