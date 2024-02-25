import { AuthTokens, Output } from "@common"
import { Field, ObjectType } from "@nestjs/graphql"
import { ResourceEntity } from "src/database/mysql/resource.entity"

@ObjectType()
export class FindManyResourcesOutput
implements Output<Array<ResourceEntity>>
{
    @Field(() => [ResourceEntity])
        data: Array<ResourceEntity>
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}
