import { AuthTokens, Output } from "@common"
import { Field, ObjectType } from "@nestjs/graphql"
import { CourseTargetEntity } from "src/database/mysql/course-target.entity"
import { LectureEntity } from "src/database/mysql/lecture.entity"
import { ResourceEntity } from "src/database/mysql/resource.entity"

@ObjectType()
export class FindOneLectureOutput
implements Output<LectureEntity>
{
    @Field(() => LectureEntity)
        data: LectureEntity
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindManyResourcesOutput
implements Output<Array<ResourceEntity>>
{
    @Field(() => [ResourceEntity])
        data: Array<ResourceEntity>
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}

@ObjectType()
export class FindManyCourseTargetsOutput
implements Output<Array<CourseTargetEntity>>
{
    @Field(() => [CourseTargetEntity])
        data: Array<CourseTargetEntity>
    @Field(() => AuthTokens, { nullable: true })
        tokens: AuthTokens
}
