import { AuthInput } from "@common"
import { Field, ID, InputType, Int } from "@nestjs/graphql"
import { IsInt } from "class-validator"

@InputType()
export class FindOnePostData {
  @Field(() => ID)
      postId: string
}

@InputType()
export class FindOnePostInput implements AuthInput<FindOnePostData> {
  @Field(() => ID)
      userId: string
  @Field(() => FindOnePostData)
      data: FindOnePostData
}

@InputType()
export class FindOnePostCommentData {
  @Field(() => ID)
      postCommentId: string
}

@InputType()
export class FindOnePostCommentInput implements AuthInput<FindOnePostCommentData> {
  @Field(() => ID)
      userId: string
  @Field(() => FindOnePostCommentData)
      data: FindOnePostCommentData
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
export class FindManyPostsData {
  @Field(() => String)
      courseId: string
  @Field(() => FindManyPostsOptions, { nullable: true })
      options?: FindManyPostsOptions
}


export class FindManyPostsInput implements AuthInput<FindManyPostsData> {
    userId: string
    data: FindManyPostsData
}