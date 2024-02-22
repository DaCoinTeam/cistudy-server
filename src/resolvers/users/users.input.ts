import { Input } from "@common"
import { Field, InputType } from "@nestjs/graphql"
import { IsUUID } from "class-validator"

@InputType()
export class FindOneUserData {
  @Field(() => String)
  @IsUUID()
      userId: string
}

export class FindOneUserInput implements Input<FindOneUserData> {
    data: FindOneUserData
}
