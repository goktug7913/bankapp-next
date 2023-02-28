import {z} from 'zod';
import {procedure, router} from '../trpc';
import * as process from "process";
import {OperationType} from "@prisma/client";
import {TRPCError} from "@trpc/server";

interface CoinAPIResponse {
    // CoinAPI response Type
    time: string;
    asset_id_base: string;
    asset_id_quote: string;
    rate: number;
}

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
                throw new TRPCError({ code: "NOT_FOUND" });
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
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
        }),

    register: procedure
        .input(z.object({
            account_id: z.string({
                description: "The account ID",
                invalid_type_error: "The account ID must be a string",
                required_error: "The account ID is required",
                }).trim().length(11, "The account ID must be 11 characters long").regex(new RegExp("^[0-9]*$"), "The account ID must be a number"),
            name: z.string(
                {
                    description: "The name",
                    invalid_type_error: "The name must be a string",
                    required_error: "The name is required",
                }
            ).min(2, "Name must be longer than 2 characters.").max(64, "Name must be shorter than 64 characters."),
            surname: z.string(
                {
                    description: "The surname",
                    invalid_type_error: "The surname must be a string",
                    required_error: "The surname is required",
                }
            ).min(2, "Surname must be longer than 2 characters.").max(64, "Surname must be shorter than 64 characters."),
            email: z.string(
                {
                    description: "The email",
                    invalid_type_error: "The email must be a string",
                    required_error: "The email is required",
                }
            ).email("The email must be a valid email address"),
            password: z.string(
                {
                    description: "The password",
                    invalid_type_error: "The password must be a string",
                    required_error: "The password is required",
                }
            ).min(8, "Password must be at least 8 characters.").max(64, "Password must be shorter than 64 characters."),
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
                    preferences: {},
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
                throw new TRPCError({
                    message:"Unauthorized",
                    code: "UNAUTHORIZED",
                })
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
                case "all":
                    const fiatA = await prisma.fiatAccount.findMany({
                        where: {parent_id: user.id},
                    });
                    const cryptoA = await prisma.cryptoAccount.findMany({
                        where: {parent_id: user.id},
                    });
                    return {accounts: [...fiatA, ...cryptoA]};
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
                throw new TRPCError({
                    message: "Unauthorized",
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
                        }
                    });

                    if (!cryptoAccount) {
                        throw new TRPCError({
                            message: "Account not found",
                            code: "NOT_FOUND",
                        })
                    }

                    // We also need to find the transactions where this account is the destination
                    const transactions = await prisma.cryptoTransaction.findMany({
                        where: {
                            OR: [
                                {source_account: cryptoAccount.account_id},
                                {destination_account: cryptoAccount.account_id},
                            ],
                        },
                    });
                    // We can't mutate the object, so we create a new one
                    const newCryptoAccount = {
                        ...cryptoAccount,
                        transactions: transactions,
                    }
                    return {account: newCryptoAccount};
                case "fiat":
                    const fiatAccount = await prisma.fiatAccount.findUnique({
                        where: {id: input._id},
                        select: {
                            id: true,
                            account_id: true,
                            name: true,
                            currency: true,
                            balance: true,
                        }
                    });
                    if (!fiatAccount) {
                        throw new TRPCError({
                            message: "Account not found",
                            code: "NOT_FOUND",
                        })
                    }

                    // We also need to find the transactions where this account is the destination
                    const transactionsFiat = await prisma.fiatTransaction.findMany({
                        where: {
                            OR: [
                                {source_account: fiatAccount.account_id},
                                {destination_account: fiatAccount.account_id},
                            ],
                        }});
                    // We can't mutate the object, so we create a new one
                    const newFiatAccount = {
                        ...fiatAccount,
                        transactions: transactionsFiat,
                    }
                    return {account: newFiatAccount};
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

    convertToDisplayCurrency: procedure
        .input(z.object({
            base_currency: z.string(),
            amount: z.number(),
        })).mutation( async ({ input, ctx }) => {
            // We should have a token in ctx that we can use to get the user's display currency
            const {prisma, user} = ctx;
            const {base_currency, amount} = input;

            // Get the user's display currency
            if (!user) { throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }) }

            const User = await prisma.masterAccount.findUnique({
                where: {id: user?.id},
                select: {
                    preferences: { select: { currency: true } }
                }
            });

            if (!User) { throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }) }

            const display_currency = User.preferences.currency;

            // If the base currency is the same as the display currency, we don't need to convert
            if (base_currency === display_currency) { return {amount: amount} }

            // Get the conversion rate
            const response = await fetch(`https://rest.coinapi.io/v1/exchangerate/${base_currency}/${display_currency}`, {
                "method": 'GET',
                "headers": {'X-CoinAPI-Key': '590DABAB-8285-4822-A43E-ED85789A98B8'}
            });
            const data: CoinAPIResponse = await response.json();
            const conversion_rate = data.rate;

            // Convert the amount
            const converted_amount = amount * conversion_rate;
            // We should round the amount to 2 decimal places
            return {amount: converted_amount.toFixed(2)};
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

            if (!User) { throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }) }

            let totalValue = 0;

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
                            rate: 23500.0
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

            if (!source || !destination) { throw new TRPCError({ code: "BAD_REQUEST" }) }

            // Check if initiator is the owner of the source account
            if (source.parent_id !== user?.id) { throw new TRPCError({ code: "BAD_REQUEST" }) }

            // Check if source account has enough balance
            if (source.balance < amount) { throw new TRPCError({ code: "BAD_REQUEST", message:"Not enough balance." }) }

            // Check if source and destination accounts are of the same type
            if (source.type !== destination.type) { throw new TRPCError({ code: "BAD_REQUEST" }) }

            // Check if source and destination accounts are of the same currency
            // TODO: Add support for cross-currency transfers
            if (source.currency !== destination.currency) { throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }) }

            const source_query = {
                where: {
                    account_id: source_account_id,
                },
                data: {
                    balance: {
                        decrement: amount,
                    }
                }
            };

            const destination_query = {
                where: {
                    account_id: destination_account_id,
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
                    parent_account_id: source.id,
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

    tryGetReceiverName: procedure
        .input(z.object({
            account_id: z.string(),
        }))
        .mutation( async ({ input, ctx }) => {
            const {prisma} = ctx;
            const {account_id} = input;

            const account = await prisma.cryptoAccount.findUnique({
                where: { account_id: account_id }
            }) || await prisma.fiatAccount.findUnique({
                where: { account_id: account_id }
            });

            if (!account) { return {receiver: ""} }

            const receiver = await prisma.masterAccount.findUnique({
                where: { id: account.parent_id },
                select: {
                    name: true,
                    surname: true,
                }
            });

            if (!receiver) { return {receiver: ""} }

            // We will return the name like "Ja**** Do****"
            return {receiver: receiver.name[0] + receiver.name[1] + "**** " + receiver.surname[0] + receiver.surname[1] + "****"};
        }),

    getStocksPortfolio: procedure
        .query( async ({ ctx }) => {
            const {prisma, user} = ctx;

            const stocksPortfolio = await prisma.stockPortfolio.findUnique({
               where: { parent_id: user?.id }
            });

            if (!stocksPortfolio) { throw new TRPCError({ code: "BAD_REQUEST" }) }

            return stocksPortfolio;
        }),
});

// export type definition of API
export type AppRouter = typeof appRouter;