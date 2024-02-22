import { Output, AuthTokens } from "@common"
import { PostCommentMySqlEntity, PostMySqlEntity } from "@database"
import { Field, ObjectType } from "@nestjs/graphql"

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
