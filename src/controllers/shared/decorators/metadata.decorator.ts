import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common"

export const Metadata = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.metadata
})

export const ROLES_KEY = "roles"
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)