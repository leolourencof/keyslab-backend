import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from './dtos/users.dto';
import { plainToInstance } from 'class-transformer';
import { IResponseGetUsers } from './users.interface';
import { QueryPaginationDto } from './dtos/pagination.dto';
import { calculatePagination } from 'src/utils/calculate-pagination';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(options: QueryPaginationDto): Promise<IResponseGetUsers> {
    const { name, email, nickname, limit, page } = options;

    const count = await this.prismaService.user.count({
      where: {
        AND: [
          { name: { mode: 'insensitive', equals: name } },
          { email: { mode: 'insensitive', equals: email } },
          { nickname: { mode: 'insensitive', equals: nickname } },
        ],
      },
    });
    const users = await this.prismaService.user.findMany({
      take: limit,
      where: {
        AND: [
          { name: { mode: 'insensitive', equals: name } },
          { email: { mode: 'insensitive', equals: email } },
          { nickname: { mode: 'insensitive', equals: nickname } },
        ],
      },
      skip: (page - 1) * limit,
    });

    const { totalPages, hasPreviousPage, hasNextPage } = calculatePagination(
      count,
      limit,
      page,
    );
    const usersWithoutPassword = plainToInstance(UserResponseDto, users);

    return {
      totalPages,
      hasPreviousPage,
      hasNextPage,
      data: usersWithoutPassword,
    };
  }

  async create(data: CreateUserDto): Promise<User> {
    const password = bcrypt.hashSync(data.password, 10);

    const createdUser = await this.prismaService.user.create({
      data: { ...data, password },
    });
    return plainToInstance(UserResponseDto, createdUser);
  }

  async findFirst(id: string): Promise<User> {
    const userFound = await this.prismaService.user.findFirst({
      where: { id },
    });
    return plainToInstance(UserResponseDto, userFound);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    let password: string;

    if (data.password) {
      password = bcrypt.hashSync(data.password, 10);
    }

    const userUpdated = await this.prismaService.user.update({
      where: { id },
      data: { ...data, password },
    });
    return plainToInstance(UserResponseDto, userUpdated);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id } });
  }
}
