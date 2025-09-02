import { ROLES_KEY } from '@/decorators/roles.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('🔍 ROLE DEBUG:');
    console.log('Required roles:', requiredRoles);
    console.log('User role:', user?.role);
    console.log('Role match:', requiredRoles.includes(user?.role));
    return requiredRoles.includes(user?.role);
  }
}
