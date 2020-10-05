import {IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import React, {useState} from 'react';
import './Page.css';

interface Props{
    onLogin: () => void;
}

const Login: React.FC<Props> = ({onLogin}) => {

    const [loggedIn, setLoggedIn] = useState(false);
    console.log(loggedIn);
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
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">Login</IonTitle>
              </IonToolbar>
            </IonHeader>
                <IonButton
                    expand="block"
                    onClick={onLogin = () => {setLoggedIn(true)}}
                >Login</IonButton>
          </IonContent>
        </IonPage>
    );
};

export default Login;
