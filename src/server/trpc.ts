import { initTRPC } from '@trpc/server';
import {Context} from "@/server/context";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.

const t = initTRPC.context<Context>().create();

// TRPC Middleware can be added here.

// Base router and procedure helpers
export const router = t.router;

export const procedure = t.procedure;

export const protectedProcedure = t.procedure.use(async (ctx, next) => {
    if (!ctx.user) {
        throw new Error('Not authenticated');
    }
    return next();
});