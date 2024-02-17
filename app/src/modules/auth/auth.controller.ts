import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() data: AuthLoginDto, @Res() response: Response) {
    const access_token = await this.authService.signIn(data);

    response.cookie('key_labs_token', access_token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: true,
    });

    response.json({ message: 'Logged in successfully' });
  }
}
