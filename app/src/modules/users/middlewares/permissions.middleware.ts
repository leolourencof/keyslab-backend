import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PermissionsMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authToken = req.cookies.key_labs_token;

    try {
      await this.jwtService.verifyAsync(authToken);
    } catch (error) {
      throw new UnauthorizedException(error.message.toUpperCase());
    }

    const docodedToken = this.jwtService.decode(authToken);

    if (docodedToken?.subject !== req.params.id) {
      throw new ForbiddenException('You do not have permission to access');
    }
    next();
  }
}
