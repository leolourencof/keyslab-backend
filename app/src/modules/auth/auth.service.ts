import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { AuthLoginDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(@Body() data: AuthLoginDto): Promise<string> {
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !bcrypt.compareSync(data.password, user.password)) {
      throw new UnauthorizedException('Incorrect password or email');
    }

    return await this.jwtService.signAsync({ subject: user.id });
  }
}
