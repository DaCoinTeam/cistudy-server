import { Output, AuthTokens } from "@common"
import { PostCommentMySqlEntity, PostMySqlEntity } from "@database"
import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class FindOnePostOutput
implements Output<PostMySqlEntity>
{
    @Field(() => PostMySqlEntity)
        data: PostMySqlEntity
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindManyPostsOutput
implements Output<Array<PostMySqlEntity>>
{
    @Field(() => [PostMySqlEntity])
        data: Array<PostMySqlEntity>
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindOnePostCommentOutput
implements Output<PostCommentMySqlEntity>
{
    @Field(() => PostCommentMySqlEntity)
        data: PostCommentMySqlEntity
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindManyPostCommentsOutput
implements Output<Array<PostCommentMySqlEntity>>
{
    @Field(() => [PostCommentMySqlEntity])
        data: Array<PostCommentMySqlEntity>
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindManyPostsMetadataOutputData {
    @Field(() => Int)
        numberOfPosts: number
}

@ObjectType()
export class FindManyPostsMetadataOutput
implements Output<FindManyPostsMetadataOutputData>
{
    @Field(() => FindManyPostsMetadataOutputData)
        data: FindManyPostsMetadataOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindManyPostCommentsMetadataOutputData {
    @Field(() => Int)
        numberOfPostComments: number
}

@ObjectType()
export class FindManyPostCommentsMetadataOutput
implements Output<FindManyPostCommentsMetadataOutputData>
{
    @Field(() => FindManyPostCommentsMetadataOutputData)
        data: FindManyPostCommentsMetadataOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}