import {useRouter} from "next/router";
import SendMoney from "@/components/sendMoney";

export default function SendMoneyPage() {
    // We will get a default account from the previous page
    // That way we can pre-select the account
    const router = useRouter();
    const { sender_account } = router.query;

    return (
        <SendMoney sender_account={sender_account} />
    )
}