import { Output, AuthTokens } from "@common"
import { CourseMySqlEntity } from "@database"
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class FindManySelfCreatedCoursesOutput
implements Output<Array<CourseMySqlEntity>>
{
    @Field(() => [CourseMySqlEntity])
        data: Array<CourseMySqlEntity>
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}
