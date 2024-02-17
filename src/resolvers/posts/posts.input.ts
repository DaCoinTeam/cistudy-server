import { Field, ID, InputType, Int } from "@nestjs/graphql"
import { IsInt } from "class-validator"

@InputType()
export class FindOnePostInput {
  @Field(() => ID)
      postId: string
}

@InputType()
export class FindManyPostsOptions {
  @Field(() => Int, { nullable: true })
  @IsInt()
      take?: number
  @Field(() => Int, { nullable: true })
  @IsInt()
      skip?: number
}

@InputType()
export class FindManyPostsInput {
  @Field(() => String)
      courseId: string
  @Field(() => FindManyPostsOptions, { nullable: true })
      options?: FindManyPostsOptions
}
