import {
    IonButton,
    IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonContent,
    IonHeader, IonImg, IonInput, IonItem, IonLabel,
    IonList, IonLoading,
    IonMenuButton,
    IonPage, IonText, IonThumbnail,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import React, {useState} from 'react';
import './Page.css';
import {Redirect} from "react-router";
import { useAuth } from '../auth';
import { auth } from '../firebase';
import {image} from "ionicons/icons";

const Login: React.FC = () => {

    const loggedIn = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({error:false, loading: false, message: ''});

    const logginLandle = async () => {
        try {
            setStatus({error:false, loading: true, message: ''});
            await auth.signInWithEmailAndPassword(email, password);
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
                      <IonButton expand="block" onClick={ logginLandle }>
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
