import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        if (tokenString) {
            console.log("useToken.ts: Token found: " + tokenString);
            const userToken = JSON.parse(tokenString);
            return userToken?.token
        }
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken: { token: any; }) => {
        sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
    };

    return [token, saveToken];
}