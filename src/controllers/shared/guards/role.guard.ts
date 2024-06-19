import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccountRole, Payload } from '@common';
import { ROLES_KEY } from '../decorators';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<AccountRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    console.log(requiredRoles)

    const request = context.switchToHttp().getRequest();
    const { accountRole } = request.user as Payload; 

    console.log(request.user)
    console.log("Role cua tao la : " + accountRole)
    
    if (!requiredRoles.some((role) => accountRole === role)) {
      throw new ForbiddenException('You do not have the permission to perform this action');
    }

    return true;
  }
}
