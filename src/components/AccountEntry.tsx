import {
    Accordion, AccordionDetails, AccordionSummary, Box, Button, Modal, Pagination, Skeleton, Stack, Typography
} from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import React, {useEffect, useState} from "react";
import Grid2 from "@mui/material/Unstable_Grid2";
import {ICryptoAccount, IFiatAccount} from "@/model/UserModels"; // TODO: We have Prisma, get rid of this
import useMediaQuery from "@mui/material/useMediaQuery";
import {trpc} from "@/utils/trpc";
import {useRouter} from "next/router";
import TxDetailsModal from "@/components/TxDetailsModal";

export interface AccountEntryProps {
    m_id: string
    type: "fiat" | "crypto";
    onAccountChange: (account: IFiatAccount | ICryptoAccount) => void;
}
export const AccountEntry = (props:AccountEntryProps) => {
    const qc = trpc.useContext();
    const router = useRouter();

    const PrefferedCurrencyMutation = trpc.convertToDisplayCurrency.useMutation({
        onSuccess: (data) => {

        },
        onError: (err) => {
            console.log("Preffered currency error: ",err);
        }
    });

    const AccountQuery = trpc.getSubAccount.useQuery({ _id: props.m_id, type: props.type}, {
        enabled: props.m_id !== "",
        onSuccess: (data) => {
            // Order transactions by date
            // We might be able to do this in the backend, but the way we query the data is a bit weird
            data.account?.transactions?.sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            setAccState(data.account)

            PrefferedCurrencyMutation.mutate({
                base_currency:accState?.currency as string,
                amount: accState?.balance as number });
        },
        refetchOnWindowFocus: "always",
    });

    const [expanded, setExpanded] = useState(false); // We do not have a purpose for this yet
    const [accState, setAccState] = useState(AccountQuery.data?.account);
    const [page, setPage] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(accState?.transactions?.[0]);

    const FaucetRequest = trpc.faucet.useMutation({
        onSuccess: (data) => {
            setProcessing(false);
            qc.invalidate().then();
        },
        onError: (err) => {
            setProcessing(false);
            console.log("Faucet error: ",err);
        },
    });

    const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded);
    }

    const handleClosureRequest = () => {

    }

    const handleFaucetRequest = () => {
        setProcessing(true);
        FaucetRequest.mutate({
            _id: accState?.id as string,
            type: props.type,
            amount: 10,
        })
    }

    const handleSendRequest = () => {
        // Redirect to send money page with account id
        router.push("/sendMoney?account=" + accState?.account_id).then();
    }

    const handleHistoryRequest = () => { alert("History request not implemented yet") }

    const parseDate = (date: any) => {
        const d = new Date(date);
        const opt = {
            year: "2-digit",
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        } as Intl.DateTimeFormatOptions;
        const locale = navigator.language; // Find user's locale
        return d.toLocaleString(locale, opt);
    }

    const CalculateTransactionPages = () => {
        // 10 transactions per page
        if (!accState?.transactions?.length) return 0; // TS complains about undefined
        return Math.ceil(accState?.transactions?.length / 10);
    }

    const FillPages = () => {
        const pages = CalculateTransactionPages();
        let items = [];
        // 10 transactions per page
        for (let i = 1; i <= pages; i++) {
            items.push(accState?.transactions?.slice((i-1)*10, i*10));
        }
    }

    useEffect(() => {
        FillPages();
    }, [accState?.transactions]);

    function onClose() {
        setModalOpen(false);
    }

    const largeScreen = useMediaQuery((theme: { breakpoints: { up: (arg0: string) => any; }; }) => theme.breakpoints.up('md'));

    return (
        <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{ml:0,pl:0}}>
                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                    <Typography>
                        <Grid2 container spacing={1}>
                            <Grid2><AccountBalanceWalletIcon sx={{fontSize: 24}} /></Grid2>
                            {AccountQuery.isLoading ? <Skeleton variant="text" width={140} /> : <Grid2>{accState?.name}</Grid2>}
                        </Grid2>
                    </Typography>

                    {AccountQuery.isFetching ? <Skeleton variant="text" width={40} />
                        :
                        <Stack direction={"row"} gap={2}>
                            {!PrefferedCurrencyMutation.isLoading && <Typography variant={"caption"} color={"darkgray"}>
                                ≈{PrefferedCurrencyMutation?.data?.amount + "$"}
                            </Typography>}
                            <Typography>
                                {accState?.balance.toLocaleString() + " " + accState?.currency}
                            </Typography>
                        </Stack>}

                </Box>
            </AccordionSummary>

            <AccordionDetails >
                <Typography sx={{mx:0.5, mb:1}}>Account Number: {accState?.account_id}</Typography>

                <Stack direction="row" gap={1} sx={{m:0.5}}>
                    <Button disabled={processing} variant="outlined" color={"primary"} onClick={handleSendRequest}>Send</Button>
                    <Button disabled={processing} variant="outlined" color={"secondary"} onClick={handleHistoryRequest}>History</Button>
                    <Button disabled={processing} variant="outlined" color={"success"} onClick={handleFaucetRequest}>Test Faucet</Button>
                    <Button disabled={processing} variant="outlined" color={"error"} onClick={handleClosureRequest}>Remove</Button>
                </Stack>

                <Accordion sx={{mt:2}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography sx={{mx:1}}>{
                            accState?.transactions?.length === 0 ?
                                "No transactions" :
                                accState?.transactions?.length === 1 ? "1 transaction" : accState?.transactions?.length + " transactions"
                        }</Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{px:0}}>
                        <Box sx={{width:"maxWidth"}}>
                            <Pagination count={CalculateTransactionPages()} showFirstButton showLastButton size={"small"} onChange={(event: React.ChangeEvent<unknown>, page: number) => {setPage(page)}} />

                            {accState?.transactions?.length ? accState?.transactions?.slice(page*10-10,page*10).map( // Check if the slice is correct
                                (transaction) => (
                                <Stack key={transaction.id} direction="row" gap={2} sx={{m:0.5, justifyContent:"space-between", cursor:"pointer", ":hover": {backgroundColor: "rgba(0,0,0,0.3)"}} }
                                       onClick={ () => { setModalData(transaction); setModalOpen(true) }}
                                >
                                    <Typography >{transaction.type}</Typography>
                                    <Stack direction={"row"} gap={2}>
                                        <Typography >{parseDate(transaction.date)}</Typography>
                                        <Typography color={transaction.source_account===accState.account_id ? "red" : "green"}>{transaction.amount + " " + transaction.currency}</Typography>
                                    </Stack>
                                </Stack>
                            )
                        ) : <Typography>No transactions so far.</Typography>}
                        </Box>
                    </AccordionDetails>
                </Accordion>

            </AccordionDetails>

            <Modal
                open={modalOpen}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <TxDetailsModal tx={modalData} open={modalOpen} onClose={onClose} />
            </Modal>

        </Accordion>
    );
}