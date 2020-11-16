import {IonButtons, IonCard, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import React from 'react';
import './Page.css';

const Top10: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>My top 10 movies</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
        </IonHeader>
          <IonCard>
              This page is under construction
          </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Top10;
