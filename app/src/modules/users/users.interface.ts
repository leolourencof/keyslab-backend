import { User } from '@prisma/client';

export interface IResponseGetUsers {
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  data: User[];
}
