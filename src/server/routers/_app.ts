import { z } from 'zod';
import { procedure, router } from '../trpc';

// This is the main application router.
// Subrouters reside in their own files in this folder.
export const appRouter = router({

    login: procedure
        .input(
            z.object({
                account_id: z.string(),
                password: z.string(),
            }),
        )
        .mutation( async ({ input, ctx }) => {
            const { account_id, password } = input;
            const { prisma } = ctx;
            console.log("account_id: " + account_id);

            const user = await prisma.masteraccounts.findUnique({
                where: {
                    account_id: account_id,
                },
            });

            if (user) {
                if (user.password === password) {
                    return user;
                } else {
                    return "Wrong password";
                }
            } else {
                return "User not found";
            }
        }),

    register: procedure
        .input(z.object({
            account_id: z.string(),
            name: z.string(),
            surname: z.string(),
            email: z.string(),
            password: z.string(),
        })).query( ({ input, ctx }) => {}),

    getAccount: procedure
        .input(z.object({})).query( ({ input, ctx }) => {}),

    updateAccount: procedure
        .input(z.object({})).query( ({ input, ctx }) => {}),

    createFiatAccount: procedure
        .input(z.object({})).query( ({ input, ctx }) => {}),

    createCryptoAccount: procedure
        .input(z.object({})).query( ({ input, ctx }) => {}),

    deleteMasterAccount: procedure
        .input(z.object({})).query( ({ input, ctx }) => {}),

    deleteFiatAccount: procedure
        .input(z.object({})).query( ({ input, ctx }) => {}),

    deleteCryptoAccount: procedure
        .input(z.object({})).query( ({ input, ctx }) => {}),

    faucet: procedure
        .input(z.object({
            // TODO: add input for amount
            account_id: z.string(),
        })).query( async ({input, ctx}) => {
            const {prisma} = ctx;
            const {account_id} = input;
            console.log("account_id: " + account_id);

            const user = await prisma.masteraccounts.findUnique({
                where: {
                    account_id: account_id,
                },
            });

            if (user) {
                const balance = user.balance;
                const newBalance = balance + 100;
                const updatedUser = await prisma.masteraccounts.update({
                    where: {
                        account_id: account_id,
                    },
                    data: {
                        balance: newBalance,
                    },
                });
                return updatedUser;
            }
        }),

    getIdFromToken: procedure
        .input(z.object({})).query( ({ input, ctx }) => {}),
});

// export type definition of API
export type AppRouter = typeof appRouter;