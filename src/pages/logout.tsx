import {useContext} from "react";
import {UserCtx} from "@/context/UserState";
import {useRouter} from "next/router";
import dynamic from "next/dynamic";

function Logout() {

    const UserContext = useContext(UserCtx);
    const router = useRouter()

    router.push("/").then(
        () => {
            // Clear user data
            UserContext.setUser({} as any);
            // Clear session storage
            sessionStorage.clear();
        }
    );

    return (
        <p>Logging out...</p>
    )
}

export default function LogoutCSR() {dynamic(() => Promise.resolve(Logout), { ssr: false }) }