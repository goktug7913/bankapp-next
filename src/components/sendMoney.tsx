import {
    Alert,
    Box,
    Button, Divider,
    FormControl, InputAdornment,
    InputLabel,
    MenuItem,
    Select, Skeleton,
    Stack, Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import React from "react";
import {trpc} from "@/utils/trpc";
import {useRouter} from "next/router";

interface IInitialProps {
    sender_account?: string | string[] | undefined;
}

export default function SendMoney( {sender_account}: IInitialProps) {
    const Accounts = trpc.getSubAccounts.useQuery({ type: "all" },
        {
            onSuccess: (data) => {
                // Let's find the account we want to pre-select
                if (sender_account) {
                    const account = data.accounts.find((a: any) => a.account_id === sender_account);
                    if (account) {
                        setSelectedAccount(account);
                    }
                } else {
                    // If we don't have a default account, let's select the first one
                    setSelectedAccount(data.accounts[0]);
                }
            }
        });

    const SendMutate = trpc.transferMoney.useMutation({
        onSuccess: () => {
            console.log("Success");
        },
        onError: (err) => {
            setError(err.message);
        },
    });

    const ReceiverMutate = trpc.tryGetReceiverName.useMutation({
        onSuccess: (data) => {
            if (data.receiver) setReceiverName(data.receiver)
            else setReceiverName("Unknown");
        }
    });

    const [selectedAccount, setSelectedAccount] = React.useState(Accounts.data?.accounts[0]);
    const [receiverAccount, setReceiverAccount] = React.useState<string>("");
    const [receiverName, setReceiverName] = React.useState<string>("Unknown");
    const [amount, setAmount] = React.useState<number>(0);
    const [description, setDescription] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");

    const router = useRouter();

    function setSenderAccount(e: any) {
        // We could directly use setSelectedAccount in the Select onChange
        // But we might want to do some extra stuff here, so we use this for now
        setSelectedAccount(e.target.value);
    }

    function sendMoney() {
        const data = {
            source_account_id: selectedAccount?.account_id,
            receiver_account: receiverAccount.toString(),
            amount: amount,
            description: description
        }
        // Validate data
        if (!data.source_account_id) {

        }
        // Send money
        SendMutate.mutate(
            {
                source_account_id: selectedAccount?.account_id as string,
                destination_account_id: receiverAccount.toString(),
                amount: parseFloat(amount.toString()),
                description: description
            }
        );
    }

    function TryGetReceiverName(e: any) {
        console.log("TryGetReceiverName: " + receiverAccount);
        ReceiverMutate.mutate({
            account_id: receiverAccount
        });
    }

    function cancel() {
     router.back();
    }

    return (
        <Box sx={{ p:2 }}>
            <Typography variant="h5">Transfer</Typography>
            <Divider sx={{ my: 2, mb:3 }} />
            <Box>
                <FormControl sx={{display: "flex"}}>
                    <InputLabel id="account-label">Select Account</InputLabel>
                        <Select
                            labelId="account-label"
                            id="account"
                            label="Select Account"
                            value={selectedAccount}
                            fullWidth
                            sx={{ flexGrow: 1 }}
                            onChange={setSenderAccount}
                            disabled={SendMutate.isLoading}
                            required
                        >
                            {Accounts.data?.accounts.map((c: any) => (
                                <MenuItem key={c.id} value={c}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Stack direction="column" spacing={1}>
                                            <Typography>{c.name}</Typography>
                                            <Typography variant="caption">{c.account_id}</Typography>
                                        </Stack>

                                        <Stack direction="row" spacing={1}>
                                            <Typography>{c.balance}</Typography>
                                            <Typography>{c.currency}</Typography>
                                        </Stack>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Select>
                </FormControl>
            </Box>

            <Box sx={{ pt:2 }}>
                <TextField required disabled={SendMutate.isLoading} fullWidth label="Receiver Account Number" value={receiverAccount} onChange={(e) => setReceiverAccount(e.target.value)}
                onBlur={TryGetReceiverName}
                />
            </Box>

            <Box sx={{ pt:2 }}>
                <TextField required type={"number"} disabled={SendMutate.isLoading} fullWidth label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position={"end"}>{selectedAccount?.currency}</InputAdornment>
                    }}
                />
            </Box>

            <Box sx={{ pt:2 }}>
                <TextField disabled={SendMutate.isLoading} fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
            </Box>

            <Alert sx={{mt:2}} severity={"info"}>
                <Stack direction={"row"} gap={2}>
                    Sending to: {ReceiverMutate.isLoading ? <Skeleton variant={"text"} width={100} /> : receiverName}
                </Stack>
            </Alert>

            {error && <Alert sx={{mt:2}} severity={"error"}>{error}</Alert>}

            <Stack direction="row" spacing={2} sx={{ pt:2 }}>
                <Button variant="outlined" color={"success"} onClick={sendMoney} disabled={SendMutate.isLoading}>Send</Button>
                <Button variant="outlined" color={"error"} onClick={cancel}>Cancel</Button>
            </Stack>
        </Box>
    )
}