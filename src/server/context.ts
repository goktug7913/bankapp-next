import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { PrismaClient } from '@prisma/client';

// This is the context that will be available in all our resolvers.

const prisma = new PrismaClient();

export const createContext = () => {
  return {
    prisma,
  };
}

export type Context = ReturnType<typeof createContext>;