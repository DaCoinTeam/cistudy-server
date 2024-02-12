import { IEmptyDataInput } from "@common"
import { Field, InputType } from "@nestjs/graphql"
import { IsUUID } from "class-validator"

@InputType()
export class FindProfileByBearerTokenInput implements IEmptyDataInput {
    @Field(() => String)
    @IsUUID()
        userId: string
} 