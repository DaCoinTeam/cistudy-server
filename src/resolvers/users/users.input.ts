import { Input } from "@common"
import { Field, InputType } from "@nestjs/graphql"
import { IsUUID } from "class-validator"

@InputType()
export class FindOneUserOptions {
    @Field(() => String)
    @IsUUID()
        followerId: string
}

@InputType()
export class FindOneUserData {
    @Field(() => String)
    @IsUUID()
        userId: string

    @Field(() => FindOneUserOptions, { nullable: true })
        options?: FindOneUserOptions
}

export class FindOneUserInput implements Input<FindOneUserData> {
    data: FindOneUserData
}
