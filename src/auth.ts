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
                const accessToken = getAccessToken();

                getUser(firebaseUser.uid, firebaseUser.email).then((results) => {
                    if(results?.error === 0){
                        const u = {
                            username: results.result.username,
                            name: results.result.name,
                            photo: results.result.icon,
                            qr: results.result.qr,
                            birthday: results.result.birthday,
                            token: accessToken
                        }
                        rootDispatcher.updateUser(u)
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

export function requestOptions(){
    const token = getAccessToken();
    const domain = 'https://marios.com.gr/movies/api';
    const options = {
        method: 'GET',
        //headers: { 'Authorization': 'Bearer ' + token }
    };
    return {token: token, domain: domain, options: options};
}

export function createAccessToken(){
    const jwt  =  require('jsonwebtoken');
    const uid = getCurrentUser().uid
    const key = "mm2563";
    const  expiresIn  =  24  *  60  *  60;
    const token = jwt.sign({ id: uid }, key, {
        expiresIn:  expiresIn
    });
    localStorage.setItem('accessToken', token);
    return token;
}

export function validateAccessToken(token){
    const jwt  =  require('jsonwebtoken');
    const key = "mm2563";
    try {
        let decoded = jwt.verify(token, key);
        let now = +(new Date().getTime() / 1000).toFixed(0)
        if(decoded.exp - now < 600){
            return false
        }
    } catch(err) {
        return false
    }
    return true
}

export function getAccessToken(){
    let token = localStorage.getItem('accessToken');
    if(!token || !validateAccessToken(token)){
        token = createAccessToken();
    }
    return token
}
