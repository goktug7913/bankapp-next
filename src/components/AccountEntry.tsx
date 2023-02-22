import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Box, Button, Pagination,
    Stack,
    Typography
} from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import React, {useContext, useEffect, useState} from "react";
import Grid2 from "@mui/material/Unstable_Grid2";
import {UserCtx} from "@/context/UserState";
import {ICryptoAccount, IFiatAccount, ITransaction} from "@/model/UserModels";
import useMediaQuery from "@mui/material/useMediaQuery";
import {trpc} from "@/utils/trpc";

export interface AccountEntryProps {
    account: IFiatAccount | ICryptoAccount;
    type: "fiat" | "crypto";
    onAccountChange: (account: IFiatAccount | ICryptoAccount) => void;
}
export const AccountEntry = (props:AccountEntryProps) => {
    const {account, onAccountChange} = props;

    const [expanded, setExpanded] = useState(false);
    const [accState, setAccState] = useState(account);
    const [page, setPage] = useState(1);
    const UserContext = useContext(UserCtx).user;
    const SetUserContext = useContext(UserCtx).setUser;
    const [processing, setProcessing] = useState(false);

    const  AccountData = trpc.getSubAccount.useQuery({ account_id: accState.account_id, type: props.type});

    useEffect(() => {
        console.log(AccountData.data);
        if (AccountData.data) {
            setAccState(AccountData.data.account);
        }
    }, [AccountData.data]);

    const FaucetRequest = trpc.faucet.useMutation({
        onSuccess: (data) => {
            console.log("Faucet ok: ",data);
            // TODO: Invalidate the query
        },
        onError: (err) => {
            console.log("Faucet error: ",err);
        },
    });

    const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded);
    }

    const handleClosureRequest = () => {
        // axiosInstance.delete("/account/"+props.type+"/"+account.account_id)
        //     .then((res) => {
        //         console.log(res);
        //         setAccState(res.data);
        //         onAccountChange(res.data);
        //     }).catch((err) => {
        //     console.log(err);
        // });
    }

    const handleFaucetRequest = () => {
        FaucetRequest.mutate({
            account_id: accState.account_id,
            type: props.type,
            amount: 10,
            subaccount_id: props.account.account_id
        })
    }

    const handleSendRequest = () => {
        alert("Send request not implemented yet");
    }

    const handleHistoryRequest = () => {
        alert("History request not implemented yet");
    }

    const parseDate = (date: any) => {
        const d = new Date(date);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    }

    const CalculateTransactionPages = () => {
        // 10 transactions per page
        return Math.ceil(accState.transactions?.length / 10);
    }

    const FillPages = () => {
        const pages = CalculateTransactionPages();
        let items = [];
        // 10 transactions per page
        for (let i = 1; i <= pages; i++) {
            items.push(accState.transactions?.slice((i-1)*10, i*10));
        }
    }

    useEffect(() => {
        FillPages();
    }, [accState.transactions]);

    const largeScreen = useMediaQuery((theme: { breakpoints: { up: (arg0: string) => any; }; }) => theme.breakpoints.up('md'));

    return (
        <Accordion sx={{maxWidth:largeScreen ? 600 : 1200, minWidth:largeScreen ? 500 : 350}}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                    <Typography>
                        <Grid2 container spacing={1}>
                            <Grid2><AccountBalanceWalletIcon sx={{fontSize: 24}} /></Grid2>
                            <Grid2>{accState.name}</Grid2>
                        </Grid2>
                    </Typography>

                    <Typography>{accState.balance + " " + accState.currency}</Typography>
                </div>
            </AccordionSummary>

            <AccordionDetails >
                <Typography sx={{mx:0.5, mb:1}}>Account Number: {accState.account_id}</Typography>

                <Stack direction="row" gap={2} sx={{m:0.5}}>
                    <Button disabled={processing} variant="outlined" color={"primary"} onClick={handleSendRequest}>Send</Button>
                    <Button disabled={processing} variant="outlined" color={"secondary"} onClick={handleHistoryRequest}>History</Button>
                    <Button disabled={processing} variant="outlined" color={"success"} onClick={handleFaucetRequest}>Test Faucet</Button>
                    <Button disabled={processing} variant="outlined" color={"error"} onClick={handleClosureRequest}>Remove</Button>
                </Stack>

                <Accordion sx={{mt:2}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography sx={{mx:1}}>{
                            props.account.transactions?.length === 0 ?
                                "No transactions" :
                                props.account.transactions?.length === 1 ? "1 transaction" : accState.transactions?.length + " transactions"
                        }</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{width:"maxWidth"}}>
                            <Pagination count={CalculateTransactionPages()} showFirstButton showLastButton size={"small"} onChange={(event: React.ChangeEvent<unknown>, page: number) => {setPage(page);}}/>

                            {accState.transactions?.length ? accState.transactions?.slice(page*10-10,page*10).map( // Check if the slice is correct
                                (transaction: ITransaction) => (
                                <Stack key={transaction.id} direction="row" gap={2} sx={{m:0.5, justifyContent:"space-between"}}>
                                    <Typography >{transaction.type}</Typography>
                                    <Stack direction={"row"} gap={2}>
                                        <Typography >{parseDate(transaction.date)}</Typography>
                                        <Typography color={transaction.amount>0 ? "green" : "red"}>{transaction.amount + " " + transaction.currency}</Typography>
                                    </Stack>
                                </Stack>
                            )
                        ) : <Typography>No transactions so far.</Typography>}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </AccordionDetails>
        </Accordion>
    );
}