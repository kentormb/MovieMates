import {
    IonBackButton, IonButton,
    IonButtons,
    IonContent,
    IonHeader, IonIcon,
    IonPage,
    IonTitle,
    IonToolbar, useIonViewWillEnter
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router';
import './Page.css';
import MatchedMovies from '../components/MatchedMovies';
import {deleteFriend, getFriendById} from "../components/Api";
import {trashOutline, trashSharp} from "ionicons/icons";
import { useHistory } from 'react-router-dom';
import {getCurrentUser} from "../auth";


const Friend: React.FC = () => {
  const { id } = useParams();
  const [userData, getUserData] = useState({name: '', icon: ''});
  const history = useHistory()

    function deleteFriendHandle(id: number) {
        deleteFriend(getCurrentUser().uid, id).then(()=>{
            history.goBack()
        })

    }

  useIonViewWillEnter(()=>{
      getFriendById(id).then((result)=>{
          getUserData({name: result.result.name, icon: result.result.icon});
      })
  });

  return (
      <IonPage>
          <IonHeader>
              <IonToolbar>
                  <IonButtons slot="start">
                      <IonBackButton />
                  </IonButtons>
                  <IonTitle>{userData.name}</IonTitle>
                  <IonButton  slot="end" onClick={ () => { deleteFriendHandle(id) }} color="medium">
                      <IonIcon ios={trashSharp} md={trashOutline}/>
                  </IonButton>
              </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
              <MatchedMovies id={id}/>
          </IonContent>
      </IonPage>
  );
};

export default Friend;
