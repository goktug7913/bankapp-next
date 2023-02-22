import {z} from 'zod';
import {procedure, router} from '../trpc';
import * as process from "process";
import {OperationType} from "@prisma/client";
import {TRPCError} from "@trpc/server";
import * as https from "https";


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
            const {prisma, bcrypt, jwt} = ctx;
            const { account_id, password } = input;
            console.log("account_id: " + account_id);

            const user = await prisma.masterAccount.findUnique({
                where: {
                    account_id: account_id,
                },
                include: {
                    fiat_accounts: true,
                    crypto_accounts: true,
                    operations: true,
                }
            });

            if (!user) {
                console.log("user not found");
                new TRPCError({ code: "NOT_FOUND" });
                return; // To stop TypeScript from complaining
            }

            if (bcrypt.compareSync(password, user.password as string)) {
                // Passwords match
                // Let's refresh the token
                const token = jwt.sign({id: user.id}, process.env.JWT_SECRET as string, {expiresIn: '1h'});
                await prisma.masterAccount.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        token: token,
                    }
                });

                return {user: {...user, password: undefined, token: token}};
            } else {
                // Passwords don't match
                new TRPCError({ code: "UNAUTHORIZED" });
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
            const {prisma, bcrypt, jwt} = ctx;

            console.log("new registration: " + JSON.stringify(input));

            const hashedPassword = bcrypt.hashSync(input.password, 10);
            let newUser = await prisma.masterAccount.create({
                data: {
                    account_id: input.account_id,
                    name: input.name,
                    surname: input.surname,
                    email: input.email,
                    password: hashedPassword,
                    operations: {
                        create: {
                            type: OperationType.CREATE_ACCOUNT,
                        }
                    }
                },
            });

            const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET as string, {expiresIn: '1h'});

            newUser = await prisma.masterAccount.update({
                where: {
                    id: newUser.id,
                },
                data: {
                    token: token,
                }
            });

            return {user: {...newUser, password: undefined}};
        }),

    getSubAccounts: procedure
        .input(z.object({}))
        .query( async ({ input, ctx }) => {
            const {prisma, user} = ctx;
            console.log("account_id: " + user);
            if (!user) {
                new TRPCError({
                    message:"Unauthorized",
                    code: "UNAUTHORIZED",
                })
            }

            const accounts = await prisma.masterAccount.findUnique({
                where: {id: user as string},
                select: {
                    crypto_accounts: true,
                    fiat_accounts: true
                }
            });

            return {accounts: accounts};
        }),

    getSubAccount: procedure
        .input(z.object({
            account_id: z.string(),
            type: z.string(),
        }))
        .query( async ({ input, ctx }) => {
           // We look for the account in the database
            const {prisma, user} = ctx;
            console.log("account_id: " + user);

            if (!user) {
                new TRPCError({
                    message:"Unauthorized",
                    code: "UNAUTHORIZED",
                })
            }

            switch (input.type) {
                case "crypto":
                    const cryptoAccount = await prisma.cryptoAccount.findUnique({
                        where: {account_id: input.account_id},
                        select: {
                            account_id: true,
                            name: true,
                            currency: true,
                            balance: true,
                            transactions: true,
                        }
                    });
                    return {account: cryptoAccount};
                case "fiat":
                    const fiatAccount = await prisma.fiatAccount.findUnique({
                        where: {account_id: input.account_id},
                        select: {
                            account_id: true,
                            name: true,
                            currency: true,
                            balance: true,
                            transactions: true,
                        }
                    });
                    return {account: fiatAccount};
            }
        }),

    getMasterAccount: procedure
        .query( async ({ctx }) => {
            console.log("getMasterAccount");
            const {prisma, user} = ctx;
            console.log("account_id: " + user);
            return {user: user};
        }),

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
            if (!user) { return {account: null} }

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
            if (!user) { return {account: null} }

            let newAccount = await prisma.cryptoAccount.create({
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
            const {prisma, user} = ctx;
            const {account_id,subaccount_id,type, amount} = input;

            switch (type) {
                case "fiat":
                    console.log("fiat account: " + subaccount_id);
                    await prisma.fiatAccount.update({
                        where: {
                            account_id: subaccount_id,
                        },
                        data: {
                            balance: {
                                increment: amount,
                            }
                        }
                    });
                    break;

                case "crypto":
                    console.log("crypto account: " + subaccount_id);
                    await prisma.cryptoAccount.update({
                        where: {
                            account_id: subaccount_id,
                        },
                        data: {
                            balance: {
                                increment: amount,
                            }
                        }
                    });
                    break;
            }
        }),

    getCurrencies: procedure
        .query( async ({ ctx }) => {
            // This endpoint returns all available currencies
            const {prisma} = ctx;
            return await prisma.currency.findMany();
        }),

    getTotalValue: procedure
        .input(z.object({
            display_currency: z.string(),
        })).query( async ({ input, ctx }) => {
            const {prisma, user} = ctx;
            const {display_currency} = input;

            // We will convert all crypto and fiat balances to this currency
            const User = await prisma.masterAccount.findUnique({
               where: {id: user?.id},
                select: {
                    crypto_accounts: true,
                    fiat_accounts: true
                }
            });

            if (!User) { new TRPCError({ code: "INTERNAL_SERVER_ERROR" }); return; }

            let totalValue = 0;

            interface CoinAPIResponse {
                // CoinAPI response Type
                time: string;
                asset_id_base: string;
                asset_id_quote: string;
                rate: number;
            }

            // Convert all crypto balances to display currency
            for (let i = 0; i < User.crypto_accounts.length; i++) {
                const account_currency = User.crypto_accounts[i].currency;

                // We don't need to convert if the currencies are the same
                if (account_currency === display_currency) {
                    totalValue += User.crypto_accounts[i].balance;
                    continue;
                }

                // Request exchange rate from CoinAPI
                const result = await fetch(`https://rest.coinapi.io/v1/exchangerate/${account_currency}/${display_currency}`, {
                    "method": "GET",
                    "headers": {'X-CoinAPI-Key': '590DABAB-8285-4822-A43E-ED85789A98B8'}
                })
                const data: CoinAPIResponse = await result.json();

                // Add to total value
                totalValue += User.crypto_accounts[i].balance * data.rate;
            }

            // Convert all fiat balances to display currency
            for (let i = 0; i < User.fiat_accounts.length; i++) {
                const account_currency = User.fiat_accounts[i].currency;

                // We don't need to convert if the currencies are the same
                if (account_currency === display_currency) {
                    totalValue += User.fiat_accounts[i].balance;
                    continue;
                }

                // Request exchange rate from CoinAPI
                const result = await fetch(`https://rest.coinapi.io/v1/exchangerate/${account_currency}/${display_currency}`, {
                    "method": "GET",
                    "headers": {'X-CoinAPI-Key': '590DABAB-8285-4822-A43E-ED85789A98B8'}
                })
                const data: CoinAPIResponse = await result.json();

                // Add to total value
                totalValue += User.fiat_accounts[i].balance * data.rate;
            }
            // We only need 2 decimal places
            totalValue = Math.round(totalValue * 100) / 100;
            return {totalValue: totalValue};
        }),
});

// export type definition of API
export type AppRouter = typeof appRouter;