import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Button, Container,
    Pagination,
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

export interface AccountEntryProps {
    account: IFiatAccount | ICryptoAccount;
    type: string;
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

    useEffect(() => {
        // AxiosInstance.post("/account/", {account_id: UserContext.account_id})
        //     .then((res) => {
        //         SetUserContext(prevState => res?.data);
        //     }).catch((err) => {
        //     console.log(err);
        // });
    }, [accState, SetUserContext, UserContext.account_id]);

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
        // setProcessing(true);
        // const data = {
        //     master_id: UserContext.account_id,
        //     type: props.type,
        //     account_id: accState._id
        // }
        // axiosInstance.post("/account/faucet", data).then((res) => {
        //     setProcessing(false)
        //     // We need to update the account balance
        //     account.balance = res.data.balance;
        //     onAccountChange(account);
        //     setAccState(res.data);
        // }).catch((err) => {
        //     alert(err);
        // });
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
        return Math.ceil(accState.transactions.length / 10);
    }

    const FillPages = () => {
        const pages = CalculateTransactionPages();
        let items = [];
        // 10 transactions per page
        for (let i = 1; i <= pages; i++) {
            items.push(accState.transactions.slice((i-1)*10, i*10));
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
                            props.account.transactions.length === 0 ?
                                "No transactions" :
                                props.account.transactions.length === 1 ? "1 transaction" : accState.transactions.length + " transactions"
                        }</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Container>
                            <Pagination count={CalculateTransactionPages()} showFirstButton showLastButton size={"small"} onChange={(event: React.ChangeEvent<unknown>, page: number) => {setPage(page);}}/>

                        {accState.transactions.length ? accState.transactions.slice(page*10-10,page*10).map( // Check if the slice is correct
                            (transaction: ITransaction) => (
                                <Stack key={transaction._id} direction="row" gap={2} sx={{m:0.5}}>
                                    <Typography >{transaction.type +" "+parseDate(transaction.date)}</Typography>
                                    <Typography color={transaction.amount>0 ? "green" : "red"}>{transaction.amount + " " + transaction.currency}</Typography>
                                </Stack>
                            )
                        ) : <Typography>No transactions so far.</Typography>}
                        </Container>
                    </AccordionDetails>
                </Accordion>
            </AccordionDetails>
        </Accordion>
    );
}