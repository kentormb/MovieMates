import React, {useContext, useEffect, useState} from "react";
import {auth as firebaseAuth} from "./firebase";
import {getUser} from "./components/Api";
import { Dispatch } from "redux"
import { useDispatch } from "react-redux"
import {RootDispatcher} from "./store/reducer";

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
    const dispatch: Dispatch<any> = useDispatch();
    const rootDispatcher = new RootDispatcher(dispatch);

    useEffect(() => {
        return firebaseAuth.onAuthStateChanged((firebaseUser) => {
            let auth = {loggedIn: false, userId: '', userEmail: ''};
            if(firebaseUser){
                auth = {loggedIn: true, userId: firebaseUser.uid, userEmail: firebaseUser.email};

                getUser(firebaseUser.uid, firebaseUser.email).then((results) => {
                    if(results?.error === 0){
                        const user = {
                            username: results.result.username,
                            name: results.result.name,
                            photo: results.result.icon,
                            qr: results.result.qr
                        }
                        rootDispatcher.updateUser(user)
                    }
                });
            }
            setAuthInit({loading:false, auth});
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return authInit;
}

export function getCurrentUser(){
    return {uid: firebaseAuth.currentUser.uid, email: firebaseAuth.currentUser.email}
}

export function getToken(){
    const token = 'sJHxwTjXkUqrMIEmLhACpe1mW6Fy2r6njDNjKJzWe9WjtvHYCD6tpsLyZTPAYJNnIrdOpjO2nI65EHfa7MBK1x7apflambt44XG';
    return token;
}
