import {useContext} from "react";
import {UserCtx} from "@/context/UserState";
import {useRouter} from "next/router";

export default function Logout()
{
    const router = useRouter()
    const UserContext = useContext(UserCtx);
    // Clear user data
    UserContext.setUser({} as any);
    // Clear session storage
    sessionStorage.clear();
    // Redirect to home page
    router.push("/").then();
    return (
        <p>Logging out...</p>
    )
}