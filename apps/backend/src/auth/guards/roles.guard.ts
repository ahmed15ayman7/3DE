import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from '../decorators/roles.decorator';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      // لو مفيش Roles على الـ endpoint نسمح عادي
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }
  
      const { user } = context.switchToHttp().getRequest();
      console.log('user',user);
  
      if (!user || !user.role) {
        throw new ForbiddenException('User has no role or is not authenticated');
      }
  
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException('You do not have permission (role mismatch)');
      }
  
      return true;
    }
  }
  