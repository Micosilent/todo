import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './auth.service';
import { IS_PUBLIC_KEY } from './auth.decorators';
import { Reflector } from '@nestjs/core';

export type AuthorizedRequest = Request & {
  userId: string;
  headers: { authorization: string };
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  private extractToken(request: AuthorizedRequest): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // If the isPublic flag is set to true, the route is public and the guard should allow access.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Else the route is private and the guard should check for a valid JWT.
    const request = context.switchToHttp().getRequest() as AuthorizedRequest;
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: jwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request.userId = payload.sub;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
