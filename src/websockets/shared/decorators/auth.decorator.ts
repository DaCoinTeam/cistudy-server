import { Payload } from "@common"
import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const DataFromBody = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return JSON.parse(request.body.data)
})

export const UserId = createParamDecorator((_, ctx: ExecutionContext) : string => {
    const client = ctx.switchToWs().getClient()
    const { userId } = client.user as Payload
    return userId
})
