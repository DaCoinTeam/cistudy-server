import { AccountRole } from "@common";
import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common"

export const Metadata = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.metadata
})

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AccountRole[]) => SetMetadata(ROLES_KEY, roles);