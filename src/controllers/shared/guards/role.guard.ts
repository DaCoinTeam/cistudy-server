import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthTokenType, Payload } from '@common';
import { ROLES_KEY } from '../decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountMySqlEntity } from '@database';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(AccountMySqlEntity)
    private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const requiredRoles = this.reflector.getAllAndOverride<String[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles) {
      const request = context.switchToHttp().getRequest();
      const { accountId, accountRoles, type } = request.user as Payload;
      let userRoles = accountRoles
      const refresh = (type === AuthTokenType.Refresh)

      if (refresh) {

        const { accountRoles } = await this.accountMySqlRepository.findOne({
          where: {
            accountId
          },
          relations: {
            accountRoles: {
              role: true
            }
          }
        })

        userRoles = accountRoles
          .filter(accRoles => accRoles.role.isDisabled === false)  // Lọc những roles có isDisabled = false
          .map(accRoles => accRoles.role.name);
      }

      console.log("Required Roles: " + requiredRoles)
      console.log("User Roles: " + userRoles)
      const hasRequiredRoles = requiredRoles.every(role => userRoles.includes(role.toString()));

      if (!hasRequiredRoles) {
        throw new ForbiddenException('You do not have the permission to perform this action');
      }
    }

    return true;
  }
}
