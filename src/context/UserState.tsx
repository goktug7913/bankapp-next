import React, {createContext, useEffect} from "react";
import {UserAccountInterface} from "@/model/UserModels";

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
    setUser: () => {},
});

// For Child Components
type Props = {
    children?: React.ReactNode
};

export const UserProvider: React.FC<Props> = ({children}) => {
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

    // Check if the user is already logged in, and if so, validate the token
    useEffect(() => {
        if (!(sessionStorage.getItem('user'))) {
            console.log("No user found in session storage");
            return;
        }

        setUser(JSON.parse(sessionStorage.getItem('user') as string) as UserAccountInterface);
    }, []);

    // Update the session storage when the user changes
    useEffect(() => {
        if(user.account_id && user.token) {
            sessionStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    return (
        <UserCtx.Provider value={{user, setUser}}>
            {children}
        </UserCtx.Provider>
    );
};