import {
    IonBackButton, IonButton,
    IonButtons,
    IonContent,
    IonHeader, IonIcon,
    IonPage,
    IonTitle,
    IonToolbar, useIonViewWillEnter
} from '@ionic/react';
import React, {useState} from 'react';
import { useParams } from 'react-router';
import './Page.css';
import MatchedMovies from '../components/MatchedMovies';
import {deleteFriend, getFriendById} from "../components/Api";
import {trashOutline, trashSharp} from "ionicons/icons";
import { useHistory } from 'react-router-dom';
import {getCurrentUser} from "../auth";
import {RootDispatcher} from "../store/reducer";
import { useDispatch } from "react-redux"


const Friend: React.FC = () => {
    const { id } = useParams();
    const [userData, getUserData] = useState({name: '', username: '', icon: ''});
    const history = useHistory();
    const dispatch = useDispatch();
    const rootDispatcher = new RootDispatcher(dispatch);

    function deleteFriendHandle(id: number) {
        deleteFriend(getCurrentUser().uid, id).then(()=>{
            rootDispatcher.decFriendsCount()
            history.goBack()
        })

    }

  useIonViewWillEnter(()=>{
      getFriendById(id).then((result)=>{
          getUserData({name: result.result.name, username: result.result.username, icon: result.result.icon});
      })
  });

  return (
      <IonPage>
          <IonHeader>
              <IonToolbar>
                  <IonButtons slot="start">
                      <IonBackButton />
                  </IonButtons>
                  <IonTitle>{userData.name ? userData.name  : userData.username}</IonTitle>
                  <IonButton  slot="end" onClick={ () => { deleteFriendHandle(id) }} color="medium">
                      <IonIcon ios={trashSharp} md={trashOutline}/>
                  </IonButton>
              </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
              <MatchedMovies id={id} isGroup={false} />
          </IonContent>
      </IonPage>
  );
};

export default Friend;
