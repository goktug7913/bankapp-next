import React from 'react';
import {Box, Container, Divider, IconButton, InputLabel, MenuItem, Paper, Typography} from '@mui/material';


interface ITxDetailsModalProps {
    tx: any;
    open: boolean;
    onClose: () => void;
}

export default function TxDetailsModal({ tx, open, onClose }: ITxDetailsModalProps) {
    // We will get the required data from the calling component
    // This component will be used to display the details of a transaction in a modal
    // We are not responsible for creating the modal, the parent will handle that
    function parseDate(date: string) {
        const opts = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        } as Intl.DateTimeFormatOptions;
        const locale = navigator.language;

        return new Date(date).toLocaleDateString(locale, opts);
    }

    return (
        <Container sx={{ mt: 2, mx: 2, alignSelf:"center", justifySelf:"center" }} maxWidth={"sm"}>
            <Paper  sx={{ p: 2, display: 'flex', flexDirection:"column", alignItems: 'start', justifyContent: 'space-between' }}>
                <Typography variant="h5">Details</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6">Type: {tx.type}</Typography>
                <Typography variant="h6">Description: {tx.description}</Typography>
                <Typography variant="h6">Date: {parseDate(tx.date)}</Typography>
                <Typography variant="h6">Sender: {tx.source_account}</Typography>
                <Typography variant="h6">Amount: {tx.amount + " " + tx.currency}</Typography>
            </Paper>
        </Container>
    );
}