import {
    IonButton,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonContent, IonImg, IonInput, IonItem, IonLabel,
    IonList, IonLoading,
    IonPage, IonText,
} from '@ionic/react';
import React, {useState} from 'react';
import './Page.css';
import {Redirect} from "react-router";
import { useAuth } from '../auth';
import { auth } from '../firebase';

const Register: React.FC = () => {

    const loggedIn = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({error:false, loading: false, message: ''});

    const registerLandle = async () => {
        try {
            setStatus({error:false, loading: true, message: ''});
            await auth.createUserWithEmailAndPassword(email, password);
        }
        catch (error){
            setStatus({error:true, loading: false, message: error.message});
        }
    }

    if(loggedIn.loggedIn){
        return <Redirect to="/my/movies"/>
    }
    return (
        <IonPage>
            <IonContent fullscreen className='ion-padding'>
                <IonImg src="/assets/images/mm.png" className={"logo"} />
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle className={"login-title"}>Register</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonList>
                            <IonItem>
                                <IonLabel position="stacked">Email</IonLabel>
                                <IonInput type="email" value={email} onIonChange={(event) => setEmail(event.detail.value)}/>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Password</IonLabel>
                                <IonInput type="password" value={password} onIonChange={(event) => setPassword(event.detail.value)} />
                            </IonItem>
                        </IonList>
                        { status.error && <IonText color="danger">{status.message}</IonText> }
                        <IonButton
                            expand="block"
                            onClick={ registerLandle }
                        >Create Account</IonButton>
                        <IonButton expand="block" fill="clear" routerLink="/login">Login</IonButton>
                    </IonCardContent>
                </IonCard>
                <IonLoading isOpen={status.loading}/>
            </IonContent>
        </IonPage>
    );
};

export default Register;
