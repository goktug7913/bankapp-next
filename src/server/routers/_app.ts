import {z} from 'zod';
import {procedure, router} from '../trpc';
import * as process from "process";
import {OperationType} from "@prisma/client";
import {TRPCError} from "@trpc/server";


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
                        create: { type: OperationType.CREATE_ACCOUNT },
                    },
                    preferences: {}
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
        .input(z.object({
            type: z.string(),
        }))
        .query( async ({ input, ctx }) => {
            const {prisma, user} = ctx;
            if (!user) {
                new TRPCError({
                    message:"Unauthorized",
                    code: "UNAUTHORIZED",
                })
                return;
            }

            switch (input.type) {
                case "crypto":
                    const cryptoAccounts = await prisma.cryptoAccount.findMany({
                        where: {parent_id: user.id},
                    });
                    return {accounts: cryptoAccounts};
                case "fiat":
                    const fiatAccounts = await prisma.fiatAccount.findMany({
                        where: {parent_id: user.id},
                    });
                    return {accounts: fiatAccounts};
            }
        }),

    getSubAccount: procedure
        .input(z.object({
            _id: z.string(),
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
                        where: {id: input._id},
                        select: {
                            id: true,
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
                        where: {id: input._id},
                        select: {
                            id: true,
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
            _id: z.string(),
            type: z.enum(['fiat', 'crypto']),
            amount: z.number(),
        })).mutation( async ({input, ctx}) => {
            const {prisma, user} = ctx;
            const {_id,type, amount} = input;

            switch (type) {
                case "fiat":
                    console.log("fiat account: " + _id);
                    const acc = await prisma.fiatAccount.update({
                        where: {
                            id: _id,
                        },
                        data: {
                            balance: {
                                increment: amount,
                            }
                        }
                    });
                    // Create a transaction
                    await prisma.fiatTransaction.create({
                        data: {
                            parent_account_id: _id,
                            amount: amount,
                            type: "Faucet",
                            description: "Faucet",
                            currency: acc.currency,
                            date: new Date(),
                            source_account: "Faucet",
                            destination_account: acc.account_id,
                        }
                    });
                    break;

                case "crypto":
                    console.log("crypto account: " + _id);
                    const acco = await prisma.cryptoAccount.update({
                        where: {
                            id: _id,
                        },
                        data: {
                            balance: {
                                increment: amount,
                            }
                        }
                    });
                    // Create a transaction
                    await prisma.cryptoTransaction.create({
                        data: {
                            parent_account_id: _id,
                            amount: amount,
                            type: "Faucet",
                            description: "Faucet",
                            currency: acco.currency,
                            date: new Date(),
                            source_account: "Faucet",
                            destination_account: acco.account_id,
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
                // const result = await fetch(`https://rest.coinapi.io/v1/exchangerate/${account_currency}/${display_currency}`, {
                //     "method": "GET",
                //     "headers": {'X-CoinAPI-Key': '590DABAB-8285-4822-A43E-ED85789A98B8'}
                // })

                // Dummy data to not hit CoinAPI rate limit
                const result = {
                    json: () => {
                        return {
                            time: "2021-05-01T00:00:00.0000000Z",
                            asset_id_base: "BTC",
                            asset_id_quote: "USD",
                            rate: 24000.0
                        }
                    }
                }

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
                // const result = await fetch(`https://rest.coinapi.io/v1/exchangerate/${account_currency}/${display_currency}`, {
                //     "method": "GET",
                //     "headers": {'X-CoinAPI-Key': '590DABAB-8285-4822-A43E-ED85789A98B8'}
                // })
                // const data: CoinAPIResponse = await result.json();

                // Dummy data to not hit CoinAPI rate limit
                const result = {
                    json: () => {
                        return {
                            time: "2021-05-01T00:00:00.0000000Z",
                            asset_id_base: "EUR",
                            asset_id_quote: "USD",
                            rate: 1.1
                        }
                    }
                }

                const data: CoinAPIResponse = await result.json();

                // Add to total value
                totalValue += User.fiat_accounts[i].balance * data.rate;
            }
            // We only need 2 decimal places
            totalValue = Math.round(totalValue * 100) / 100;
            return {totalValue: totalValue};
        }),

    getSettings: procedure
        .query( async ({ ctx }) => {
            const {prisma, user} = ctx;

            const User = await prisma.masterAccount.findUnique({
                where: {id: user?.id},
                select: {
                    preferences: true
                }
            });

            return User?.preferences;
        }),

    transferMoney: procedure
        .input(z.object({
            source_account_id: z.string(),
            destination_account_id: z.string(),
            amount: z.number().positive(),
            description: z.string(),
        })).mutation( async ({ input, ctx }) => {
            const {prisma, user} = ctx;
            const {source_account_id, destination_account_id, amount, description} = input;

            // Get source and destination accounts, they could be crypto or fiat
            const source = await prisma.cryptoAccount.findUnique({
                where: { account_id: source_account_id }
            }) || await prisma.fiatAccount.findUnique({
                where: { account_id: source_account_id }
            });

            const destination = await prisma.cryptoAccount.findUnique({
                where: { account_id: destination_account_id }
            }) || await prisma.fiatAccount.findUnique({
                where: { account_id: destination_account_id }
            });

            if (!source || !destination) { new TRPCError({ code: "BAD_REQUEST" }); return; }

            // Check if initiator is the owner of the source account
            if (source.parent_id !== user?.id) { new TRPCError({ code: "BAD_REQUEST" }); return; }

            // Check if source account has enough balance
            if (source.balance < amount) { new TRPCError({ code: "BAD_REQUEST", message:"Not enough balance." }); return; }

            // Check if source and destination accounts are of the same type
            if (source.type !== destination.type) { new TRPCError({ code: "BAD_REQUEST" }); return; }

            // Check if source and destination accounts are of the same currency
            // TODO: Add support for cross-currency transfers
            if (source.currency !== destination.currency) { new TRPCError({ code: "INTERNAL_SERVER_ERROR" }); return; }

            const source_query = {
                where: {
                    id: source_account_id,
                },
                data: {
                    balance: {
                        decrement: amount,
                    }
                }
            };

            const destination_query = {
                where: {
                    id: destination_account_id,
                },
                data: {
                    balance: {
                        increment: amount,
                    }
                }
            }

            const transaction = {
                data: {
                    amount: amount,
                    description: description,
                    source_account: source_account_id,
                    destination_account: destination_account_id,
                    currency: source.currency,
                    type: "Transfer",
                    parent_account_id: source.account_id,
                    date: new Date(),
                }
            }

            //Update source account balance
            if (source.type === "crypto") {
                await prisma.cryptoAccount.update(source_query);
                await prisma.cryptoAccount.update(destination_query);
                await prisma.cryptoTransaction.create(transaction);
            } else {
                await prisma.fiatAccount.update(source_query);
                await prisma.fiatAccount.update(destination_query);
                await prisma.fiatTransaction.create(transaction);
            }

            return {success: true};
        }),
});

// export type definition of API
export type AppRouter = typeof appRouter;