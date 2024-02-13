import { Field, InputType } from "@nestjs/graphql"
import { IsUUID } from "class-validator"

@InputType()
export class FindOneUserInput {
  @Field(() => String)
  @IsUUID()
      userId: string
}