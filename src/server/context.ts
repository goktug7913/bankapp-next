import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: CreateNextContextOptions) {
  const prisma = new PrismaClient();

  return {
    prisma,
    bcrypt,
    jwt,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;