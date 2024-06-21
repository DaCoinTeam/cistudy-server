import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccountRole, AuthTokenType, Payload } from '@common';
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

    const requiredRoles = this.reflector.getAllAndOverride<AccountRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles) {
      const request = context.switchToHttp().getRequest();
      const { accountId, accountRole, type } = request.user as Payload;
      let userRole = accountRole
      const refresh = (type === AuthTokenType.Refresh)

      if (refresh) {
        const { accountRole } = await this.accountMySqlRepository.findOneBy({ accountId })
        userRole = accountRole
      }

      if (!requiredRoles.some((role) => userRole === role)) {
        throw new ForbiddenException('You do not have the permission to perform this action');
      }
    }

    return true;
  }
}
