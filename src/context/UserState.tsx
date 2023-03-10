import React, {createContext, useEffect} from "react";
import {UserAccountInterface} from "@/model/UserModels";
import {setAuthToken} from "@/utils/trpc";

interface ContextProps {
    user: UserAccountInterface;
    setUser: React.Dispatch<React.SetStateAction<UserAccountInterface>>;
}

export const UserCtx = createContext<ContextProps>({
    user: {
        token: "",
        account_id: '',
        name: '',
        surname: '',
        email: '',
        fiat_accounts: [],
        crypto_accounts: [],
        transactions: [],
    },
    setUser: (user: UserAccountInterface | {}) => {}
});

// For Child Components
type Props = {
    children?: React.ReactNode
};

export const UserProvider: React.FC<Props> = ({children}) => {
    // TODO: We might change this to NextAuth
    const [user, setUser] = React.useState<UserAccountInterface>({
        token: "",
        account_id: '',
        name: '',
        surname: '',
        email: '',
        fiat_accounts: [],
        crypto_accounts: [],
        transactions: [],
    });
    // WE ONLY USE SESSION STORAGE, AS WE DO NOT WANT TO STORE ANYTHING ON THE CLIENT SIDE FOR SECURITY REASONS
    // Check if the user is already logged in, and if so, validate the token
    useEffect(() => {
        if (!(sessionStorage.getItem('user'))) {
            console.log("No user found in session storage");
            return;
        }

        //setUser(JSON.parse(sessionStorage.getItem('user') as string) as UserAccountInterface);
    }, []);

    // Update the session storage when the user changes
    useEffect(() => {
        if(user.account_id && user.token) {
            sessionStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    // Let tRPC know our current token
    useEffect(() => {
        setAuthToken(user.token);
    }, [user.token]);

    return (
        <UserCtx.Provider value={{user, setUser}}>
            {children}
        </UserCtx.Provider>
    );
};