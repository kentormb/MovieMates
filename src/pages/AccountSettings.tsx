import {
    IonButtons,
    IonCard, IonCardContent,
    IonCardHeader, IonCardTitle,
    IonContent,
    IonHeader, IonItem, IonLabel, IonList,
    IonMenuButton,
    IonPage,
    IonTitle, IonToggle,
    IonToolbar,
    IonInput, IonDatetime, IonButton
} from '@ionic/react';
import React from 'react';
import './Page.css';

const Movies: React.FC = () => {


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Account Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
          <IonCard>
              <IonCardHeader>
                  <IonCardTitle>
                      <IonCardTitle>Settings</IonCardTitle>
                      <IonCardContent>
                          <IonList lines='full'>
                              <IonItem key={1}>
                                  <IonLabel>Show Swipe indicators</IonLabel>
                                  <IonToggle
                                      checked={true}
                                      onIonChange={e => {}}
                                      color="primary"
                                  />
                              </IonItem>
                          </IonList>
                      </IonCardContent>
                  </IonCardTitle>
              </IonCardHeader>
          </IonCard>
          <IonCard>
              <IonCardHeader>
                  <IonCardTitle>
                      <IonCardTitle>Account</IonCardTitle>
                      <IonCardContent>
                          <IonList lines='full'>
                              <IonItem key={1}>
                                  <IonLabel>Username</IonLabel>
                                  <IonInput slot={"end"} placeholder="Enter username" onIonChange={e => {}} />
                              </IonItem>

                              <IonItem key={2}>
                                  <IonLabel>Name</IonLabel>
                                  <IonInput slot={"end"} placeholder="Enter Name" onIonChange={e => {}} />
                              </IonItem>

                              <IonItem key={3}>
                                  <IonLabel>Birthday</IonLabel>
                                  <IonDatetime displayFormat="MMM D, YYYY" min="1940" max="2020" placeholder={"Nov 11, 2020"} value={''} onIonChange={e => {}}/>
                              </IonItem>

                              <IonItem key={4}>
                                  <IonLabel>Delete Account</IonLabel>
                                  <IonButton color="light">Delete</IonButton>
                              </IonItem>
                          </IonList>
                      </IonCardContent>
                  </IonCardTitle>
              </IonCardHeader>
          </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Movies;
