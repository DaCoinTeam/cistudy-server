import { Field, ObjectType } from "@nestjs/graphql"
import { CategoryEntity } from "../mysql/category.entity"



@ObjectType()
export class CourseCategoryLevel {
    @Field(() => [CategoryEntity], { nullable: true })
        level0Categories: Array<CategoryEntity>
    @Field(() => [CategoryEntity], { nullable: true })
        level1Categories: Array<CategoryEntity>
    @Field(() => [CategoryEntity], { nullable: true })
        level2Categories: Array<CategoryEntity>
}