import { Field, ID, InputType, Int } from "@nestjs/graphql"
import { IsInt } from "class-validator"

@InputType()
export class FindOnePostInput {
  @Field(() => ID)
      postId: string
}

@InputType()
export class FindManyPostsInput {
  @Field(() => String)
  	courseId: string
  @Field(() => Int)
  @IsInt()
  	take: number
  @Field(() => Int)
  @IsInt()
  	skip: number
}
