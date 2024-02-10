import { Field, ID, InputType } from "@nestjs/graphql"

@InputType()
export class FindOnePostInput {
  @Field(() => ID)
      postId: string
}
