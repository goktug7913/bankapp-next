import {z} from 'zod';
import {procedure, router} from '../trpc';
import * as process from "process";
import {OperationType} from "@prisma/client";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {PrismaClient} from "@prisma/client";

export const prisma = new PrismaClient();

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
            console.log("account_id: " + account_id);

            const user = await prisma.masterAccount.findUnique({
                where: {
                    account_id: account_id,
                },
            });

            if (!user) {
                console.log("user not found");
                return {user: null}; // TODO: We need to return error messages
            }

            if (bcrypt.compareSync(password, user.password)) {
                return {user: user};
            } else {
                console.log("passwords don't match");
                console.log("Received password: " + bcrypt.hashSync(password, 10));
                console.log("user.password: " + user.password);
                return {user: null}; // TODO: We need to return error messages
            }
        }),

    register: procedure
        .input(z.object({
            account_id: z.string().length(11),
            name: z.string().min(2).max(64),
            surname: z.string().min(2).max(64),
            email: z.string().email(),
            password: z.string().min(8).max(64),
        })).mutation( async ({input, ctx}) => {
            //const {prisma, bcrypt, jwt} = ctx;
            console.log("new registration: " + JSON.stringify(input));
            const hashedPassword = bcrypt.hashSync(input.password, 10);
            const token = jwt.sign({account_id: input.account_id}, process.env.JWT_SECRET as string, {expiresIn: '1h'});

            let newUser = await prisma.masterAccount.create({
                data: {
                    account_id: input.account_id,
                    name: input.name,
                    surname: input.surname,
                    email: input.email,
                    password: hashedPassword,
                    token: token,
                    operations: {
                        create: {
                            type: OperationType.CREATE_ACCOUNT,
                        }
                    }
                },
            });
            return {user: {...newUser, password: undefined}};
        }),

    getAccount: procedure
        .input(z.object({})).query( ({ input, ctx }) => {}),

    updateAccount: procedure
        .input(z.object({})).query( ({ input, ctx }) => {}),

    createFiatAccount: procedure
        .input(z.object({
            account_id: z.string(),
            currency_ticker: z.string(),
            name: z.string(),
        })).mutation( async ({ input, ctx }) => {
            const {prisma} = ctx;
            const {account_id} = input;
            console.log("account_id: " + account_id);
            const user = await prisma.masterAccount.findUnique({
                where: { account_id: account_id },
                select: { id : true }
            });

            let newAccount = await prisma.fiatAccount.create({
                data: {
                    account_id: Math.random().toString(),
                    parent_id: user.id, // TODO: Temporary solution until we set middleware
                    name: input.name,
                    currency: input.currency_ticker,
                    balance: 0,
                    is_active: true,
                },
            });
            return {account: newAccount};
        }),

    createCryptoAccount: procedure
        .input(z.object({})).mutation( ({ input, ctx }) => {}),

    deleteMasterAccount: procedure
        .input(z.object({})).query( ({ input, ctx }) => {}),

    deleteFiatAccount: procedure
        .input(z.object({})).query( ({ input, ctx }) => {}),

    deleteCryptoAccount: procedure
        .input(z.object({})).query( ({ input, ctx }) => {}),

    faucet: procedure
        .input(z.object({
            account_id: z.string(),
            type: z.enum(['fiat', 'crypto']),
            amount: z.number(),
            subaccount_id: z.string(),
        })).mutation( async ({input, ctx}) => {
            const {prisma} = ctx;
            const {account_id} = input;
            console.log("account_id: " + account_id);

            switch (input.type) {
                case "fiat":
                    await prisma.fiatAccount.update({
                        where: {
                            account_id: input.subaccount_id,
                        },
                        data: {
                            balance: {
                                increment: input.amount,
                            }
                        }
                    });
                    break;

                case "crypto":
                    await prisma.cryptoAccount.update({
                        where: {
                            account_id: input.subaccount_id,
                        },
                        data: {
                            balance: {
                                increment: input.amount,
                            }
                        }
                    });
                    break;
            }
        }),

    getIdFromToken: procedure
        .input(z.object({})).query( ({ input, ctx }) => {}),

    getCurrencies: procedure
        .query( async ({ ctx }) => {
            const {prisma} = ctx;
            return await prisma.currency.findMany();
        }),

});

// export type definition of API
export type AppRouter = typeof appRouter;