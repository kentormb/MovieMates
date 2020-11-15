import React, {useContext, useEffect, useState} from "react";
import {auth as firebaseAuth} from "./firebase";
import { Plugins } from '@capacitor/core';
import {getUser} from "./components/Api";

interface Auth{
    loggedIn: boolean;
    userId?: string;
    userEmail?: string;
}

interface AuthInit{
    loading: boolean;
    auth?: Auth;
}

export const AuthContext = React.createContext<Auth>({loggedIn: false});

export function useAuth():Auth{
    return useContext(AuthContext);
}

export function useAuthInit(){
    const [authInit, setAuthInit] = useState<AuthInit>({loading:true});

    useEffect(() => {
        return firebaseAuth.onAuthStateChanged((firebaseUser) => {
            let auth = {loggedIn: false, userId: '', userEmail: ''};
            if(firebaseUser){
                auth = {loggedIn: true, userId: firebaseUser.uid, userEmail: firebaseUser.email};
                getUser(firebaseUser.uid, firebaseUser.email).then((results) => {
                    if(results.error === 0){
                        const { Storage } = Plugins;
                        Storage.set({
                            key: 'user',
                            value: JSON.stringify({
                                username: results.result.username,
                                name: results.result.name,
                                photo: results.result.icon,
                                qr: results.result.qr
                            })
                        });
                    }
                });
            }
            setAuthInit({loading:false, auth});
        });
    }, []);

    return authInit;
}

export function getCurrentUser(){
    return {uid: firebaseAuth.currentUser.uid, email: firebaseAuth.currentUser.email}
}

export function getToken(){
    const token = 'sJHxwTjXkUqrMIEmLhACpe1mW6Fy2r6njDNjKJzWe9WjtvHYCD6tpsLyZTPAYJNnIrdOpjO2nI65EHfa7MBK1x7apflambt44XG';
    return token;
}
