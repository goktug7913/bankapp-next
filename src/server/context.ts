import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export function createContext(opts: CreateNextContextOptions) {

    const prisma = new PrismaClient();
    const { req, res } = opts;

    const auth = req.headers.authorization;
    let user = undefined;

    const needsAuth = (!req.url?.startsWith("/api/trpc/login"));
    console.log("req.url: " + req.url);
    console.log("needsAuth: " + needsAuth);

    if (auth && auth.startsWith("Bearer ") && needsAuth) {
        const token = auth.split(" ")[1];
        user = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log("user: " + user);
    } else {
        console.log("No auth header");
    }

    return {
        prisma,
        bcrypt,
        jwt,
        user,
    }
}

export type Context = inferAsyncReturnType<typeof createContext>;