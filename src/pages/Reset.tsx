import {
    IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonContent, IonImg, IonInput, IonItem, IonLabel,
    IonList, IonLoading,
    IonPage, IonText, IonToast
} from '@ionic/react';
import React, {useState} from 'react';
import './Page.css';
import { auth } from '../firebase';
import { useHistory } from 'react-router-dom';


const Reset: React.FC = () => {

    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({error:false, loading: false, message: ''});
    const [showToast, setShowToast] = useState(false);
    const history = useHistory()
    const resetHandle = () => {
        auth.sendPasswordResetEmail(email).then(data => {
            //this.router.navigateByUrl('/login');
            setShowToast(true)
        })
        .catch(error => {
            setStatus({error:true, loading: false, message: error.message});
        });
    }

    return (
        <IonPage>
            <IonContent fullscreen className='ion-padding'>
                <IonImg src="/assets/images/mm.png" className={"logo"} />
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle className={"login-title"}>Forgot your password?</IonCardTitle>
                        <IonCardSubtitle>
                            Enter your email below and we will send your instructions to recover your password
                        </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonList>
                            <IonItem>
                                <IonLabel position="stacked">Email</IonLabel>
                                <IonInput type="email" value={email} onIonChange={(event) => setEmail(event.detail.value)}/>
                            </IonItem>
                        </IonList>
                        { status.error && <IonText color="danger">{status.message}</IonText> }
                        <IonButton
                            expand="block"
                            onClick={ resetHandle }
                        >Reset Password</IonButton>
                        <IonButton expand="block" fill="clear" routerLink="/login">Already have an account?</IonButton>
                    </IonCardContent>
                </IonCard>
                <IonLoading isOpen={status.loading}/>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => { history.push('/login'); setShowToast(false)}}
                    message="Password reset email sent."
                    duration={3000}
                />
            </IonContent>
        </IonPage>
    );
};

export default Reset;
