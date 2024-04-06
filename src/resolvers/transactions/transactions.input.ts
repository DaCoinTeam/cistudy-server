import { Input, OptionsOnly } from "@common"
import { Field, InputType, Int } from "@nestjs/graphql"

@InputType()
export class FindManyTransactionsInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManyTransactionsInputData implements OptionsOnly<FindManyTransactionsInputOptions>{
    @Field(() => FindManyTransactionsInputOptions, { nullable: true })
        options?: FindManyTransactionsInputOptions
}

export class FindManyTransactionsInput
implements Input<FindManyTransactionsInputData>
{
    data: FindManyTransactionsInputData
}