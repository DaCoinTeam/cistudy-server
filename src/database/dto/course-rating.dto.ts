import { Field, Float, Int, ObjectType } from "@nestjs/graphql"


@ObjectType()
export class CourseRatingDTO {
    @Field(() => Float, { nullable: true, defaultValue: 0 })
        overallCourseRating: number
    @Field(() => Int, { nullable: true, defaultValue: 0 })
        numberOf1StarRatings: number
    @Field(() => Int, { nullable: true, defaultValue: 0 })
        numberOf2StarRatings: number
    @Field(() => Int, { nullable: true, defaultValue: 0 })
        numberOf3StarRatings: number
    @Field(() => Int, { nullable: true, defaultValue: 0 })
        numberOf4StarRatings: number
    @Field(() => Int, { nullable: true, defaultValue: 0 })
        numberOf5StarRatings: number
}