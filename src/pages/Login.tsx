import {
    IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonContent, IonImg, IonInput, IonItem, IonLabel,
    IonList, IonLoading,
    IonPage, IonText
} from '@ionic/react';
import React, {useState} from 'react';
import './Page.css';
import {Redirect} from "react-router";
import { useAuth } from '../auth';
import { auth } from '../firebase';

const Login: React.FC = () => {

    const loggedIn = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({error:false, loading: false, message: ''});

    const loginHandle = async () => {
        try {
            await auth.signInWithEmailAndPassword(email, password);
            if(!loggedIn.loggedIn){
                setStatus({error:true, loading: false, message: 'User does not exists'});
            }
            else{
                setStatus({error:false, loading: false, message: ''});
            }
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
                      <IonCardTitle className={"login-title"}>Login</IonCardTitle>
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
                      <IonButton expand="block" onClick={ loginHandle }>
                          Login
                      </IonButton>
                      <IonButton expand="block" fill="clear" routerLink="/register">Register</IonButton>
                      <IonButton expand="block" fill="clear" routerLink="/resetpassword">Forgot Password</IonButton>
                  </IonCardContent>
              </IonCard>


              <IonLoading isOpen={status.loading}/>
          </IonContent>
        </IonPage>
    );
};

export default Login;
