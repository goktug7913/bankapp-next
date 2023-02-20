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
  const { req, res } = opts;

  if (!req.headers.authorization) {
    // We don't have an authorization header, so we can't verify the user
    // User might be trying to login or register, we should handle this better
    console.log('No authorization header');
    return {
      prisma,
      bcrypt,
      jwt,
    };
  }
  const user = jwt.verify(req.headers.authorization as string,
    process.env.JWT_SECRET as string);
     console.log('user: ' + JSON.stringify(user));
  return {
    prisma,
    bcrypt,
    jwt,
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;