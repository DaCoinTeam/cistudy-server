import { Payload } from "@common"
import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const DataFromBody = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return JSON.parse(request.body.data)
})

export const AccountId = createParamDecorator((_, ctx: ExecutionContext) : string => {
    const request = ctx.switchToHttp().getRequest()
    const { accountId } = request.user as Payload
    return accountId
})
