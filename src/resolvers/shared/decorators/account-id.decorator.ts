import { Payload } from "@common"
import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"

export const AccountId = createParamDecorator(
    (_, context: ExecutionContext): string => {
        const gqlContext = GqlExecutionContext.create(context).getContext()
        const { accountId } = gqlContext.req.user as Payload
        return accountId
    },
)
