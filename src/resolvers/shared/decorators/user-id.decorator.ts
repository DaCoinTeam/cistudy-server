import { Payload } from "@common"
import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"

export const UserId = createParamDecorator(
    (_, context: ExecutionContext): string => {
        const gqlContext = GqlExecutionContext.create(context).getContext()
        const { userId } = gqlContext.req.user as Payload
        return userId
    },
)
