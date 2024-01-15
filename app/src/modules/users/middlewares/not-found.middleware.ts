import { NotFoundException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/modules/database/database.service';

@Injectable()
export class NotFoundMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.prismaService.user.findFirst({
      where: { id: req.params.id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    next();
  }
}
