import { AuthOutput, AuthTokens, ResultsWithMetadata } from "@common"
import { PostCommentMySqlEntity, PostCommentReplyMySqlEntity, PostMySqlEntity } from "@database"
import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class FindOnePostOutput implements AuthOutput<PostMySqlEntity> {
  @Field(() => PostMySqlEntity)
      data: PostMySqlEntity
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}

@ObjectType()
export class FindManyPostsOutputMetadata {
  @Field(() => Int, { nullable: true })
      count?: number
}

@ObjectType()
export class FindManyPostsOutputData
implements ResultsWithMetadata<PostMySqlEntity, FindManyPostsOutputMetadata>
{
  @Field(() => [PostMySqlEntity])
      results: Array<PostMySqlEntity>
  @Field(() => FindManyPostsOutputMetadata, { nullable: true })
      metadata: FindManyPostsOutputMetadata
}

@ObjectType()
export class FindManyPostsOutput implements AuthOutput<FindManyPostsOutputData> {
  @Field(() => FindManyPostsOutputData)
      data: FindManyPostsOutputData
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}

@ObjectType()
export class FindOnePostCommentOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindOnePostCommentOutput
implements AuthOutput<PostCommentMySqlEntity>
{
  @Field(() => PostCommentMySqlEntity)
      data: PostCommentMySqlEntity
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}

@ObjectType()
export class FindManyPostCommentsOutputData
implements
    ResultsWithMetadata<
      PostCommentMySqlEntity,
      FindOnePostCommentOutputMetadata
    >
{
  @Field(() => [PostCommentMySqlEntity])
      results: Array<PostCommentMySqlEntity>
  @Field(() => FindOnePostCommentOutputMetadata, { nullable: true })
      metadata: FindOnePostCommentOutputMetadata
}

@ObjectType()
export class FindManyPostCommentsOutput
implements AuthOutput<FindManyPostCommentsOutputData>
{
  @Field(() => FindManyPostCommentsOutputData)
      data: FindManyPostCommentsOutputData
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}

@ObjectType()
export class FindManyPostCommentRepliesOutputData
implements
    ResultsWithMetadata<
      PostCommentReplyMySqlEntity,
      FindOnePostCommentOutputMetadata
    >
{
  @Field(() => [PostCommentReplyMySqlEntity])
      results: Array<PostCommentReplyMySqlEntity>
  @Field(() => FindOnePostCommentOutputMetadata, { nullable: true })
      metadata: FindOnePostCommentOutputMetadata
}

@ObjectType()
export class FindManyPostCommentRepliesOutput
implements AuthOutput<FindManyPostCommentRepliesOutputData>
{
  @Field(() => FindManyPostCommentRepliesOutputData)
      data: FindManyPostCommentRepliesOutputData
  @Field(() => AuthTokens, { nullable: true })
      tokens: AuthTokens
}
