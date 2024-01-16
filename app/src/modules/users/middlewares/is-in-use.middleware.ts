import { ConflictException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/modules/database/database.service';

@Injectable()
export class IsInUseMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: req.body.email }, { nickname: req.body.nickname }],
      },
    });

    if (user) {
      throw new ConflictException('Email or nickname already in use');
    }
    next();
  }
}
