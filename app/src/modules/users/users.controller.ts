import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dtos/users.dto';
import { QueryPaginationDto } from './dtos/pagination.dto';
import { IResponseGetUsers } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findMany(
    @Query() options: QueryPaginationDto,
  ): Promise<IResponseGetUsers> {
    return await this.usersService.findMany(options);
  }

  @Post()
  async create(@Body() data: CreateUserDto): Promise<User> {
    return await this.usersService.create(data);
  }

  @Get(':id')
  async findFirst(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.findFirst(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, data);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.usersService.delete(id);
  }
}
