import { AuthInput } from "@common"
import { Field, InputType, Int } from "@nestjs/graphql"


@InputType()
export class FindManySelfCreatedCoursesInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManySelfCreatedCoursesInputData {
    @Field(() => FindManySelfCreatedCoursesInputOptions, { nullable: true})
        options?: FindManySelfCreatedCoursesInputOptions
}

export class FindManySelfCreatedCoursesInput
implements AuthInput<FindManySelfCreatedCoursesInputData>
{
    userId: string
    data: FindManySelfCreatedCoursesInputData
}
