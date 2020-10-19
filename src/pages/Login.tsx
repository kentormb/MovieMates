import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader, IonInput, IonItem, IonLabel,
    IonList, IonLoading,
    IonMenuButton,
    IonPage, IonText,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import React, {useState} from 'react';
import './Page.css';
import {Redirect} from "react-router";
import { useAuth } from '../auth';
import { auth } from '../firebase';
import {saveUser} from "../components/Api";

const Login: React.FC = () => {

    const loggedIn = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({error:false, loading: false, message: ''});

    const logginLandle = async () => {
        try {
            setStatus({error:false, loading: true, message: ''});
            let firebaseuser = await auth.signInWithEmailAndPassword(email, password);
            await saveUser(firebaseuser.user.uid, firebaseuser.user.email, true);
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
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>Login</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen className='ion-padding'>
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
            {status.error &&
                <IonText color="danger">{status.message}</IonText>
            }
            <IonButton
                expand="block"
                onClick={ logginLandle }
            >Login</IonButton>
            <IonButton expand="block" fill="clear" routerLink="/register">Don't have an account?</IonButton>
           <IonLoading isOpen={status.loading}/>
          </IonContent>
        </IonPage>
    );
};

export default Login;
