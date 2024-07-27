import { AuthTokenType, Payload } from "@common"
import { AccountMySqlEntity, RoleMySqlEntity } from "@database"
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ROLES_KEY } from "../decorators"


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
    private reflector: Reflector,
    @InjectRepository(AccountMySqlEntity)
    private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
    @InjectRepository(RoleMySqlEntity)
    private readonly roleMySqlRepository: Repository<RoleMySqlEntity>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if (requiredRoles) {
            const request = context.switchToHttp().getRequest()
            const { accountId, accountRoles, type } = request.user as Payload
            let userRoles = accountRoles
            const refresh = (type === AuthTokenType.Refresh)

            if (refresh) {

                const roles = await this.roleMySqlRepository.find({
                    where:{
                        accountId
                    }
                })

                userRoles = roles
                    .filter(accRoles => accRoles.isDisabled === false)  // Lọc những roles có isDisabled = false
                    .map(accRoles => accRoles.name)
            }

            console.log("Required Roles: " + requiredRoles)
            console.log("User Roles: " + userRoles)
            const hasRequiredRoles = requiredRoles.every(role => userRoles.includes(role.toString()))

            if (!hasRequiredRoles) {
                throw new ForbiddenException("You do not have the permission to perform this action")
            }
        }

        return true
    }
}
