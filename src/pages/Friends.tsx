import {
  IonAvatar, IonBadge,
  IonButton,
  IonButtons,
  IonContent, IonFab, IonFabButton,
  IonHeader,
  IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList,
  IonMenuButton, IonModal,
  IonPage, IonRadio, IonRadioGroup, IonRefresher, IonRefresherContent, IonSearchbar, IonSegment, IonSegmentButton,
  IonTitle, IonToast,
  IonToolbar
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import './Page.css';
import {add} from "ionicons/icons";
import {getCurrentUser} from "../auth";
import {addFriend, searchFriend, getFriends} from '../components/Api'
import FriendItem from "../components/FriendItem";
import { RefresherEventDetail } from '@ionic/core';

const Movies: React.FC = () => {

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setsearchQuery] = useState('');
  const [friendList, setFriendList] = useState([]);
  const [friendSearchList, setFriendSearchList] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(0);
  const [friendRequestsCount, setfriendRequestsCount] = useState(0);

  async function getUserFriends(fstatus:number = 3){
    await getFriends(getCurrentUser().uid,fstatus).then((results)=>{
      if(results.error === 0){
        setFriendList(results.result)
        setfriendRequestsCount(results.result.filter((item)=>item.status===0).length)
      }
      else{
        setFriendList([])
      }
    })
  }

  function addFriendBtn(){
    addFriend(getCurrentUser().uid, selectedFriend).then((result)=>{
      setShowToast(true)
      setShowModal(false)
    })
  }

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    getUserFriends(3).then(()=>{
      event.detail.complete()
    })
  }

  useEffect(() => {
    getUserFriends(3)
  },[])

  useEffect(() => {
    if(searchQuery.length > 2){
      searchFriend(getCurrentUser().uid,searchQuery).then((results)=>{
        if(results.error === 0){
          setFriendSearchList(results.result)
        }
        else{
          setFriendSearchList([])
        }
      })
    }
  },[searchQuery])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Friends</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent/>
        </IonRefresher>
        <IonSegment value={"mm-friend"} onIonChange={e => {
          var divsToHide = document.getElementsByClassName('mm-item')
          for(var i = 0; i < divsToHide.length; i++){
            if(divsToHide[i].className.includes(e.detail.value)){
              // @ts-ignore
              divsToHide[i].style.display = "block";
            }
            else{
              // @ts-ignore
              divsToHide[i].style.display = "none";
            }
          }
        }}>
          <IonSegmentButton value="mm-friend" >
            <IonLabel>Friends</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="mm-request">
            <IonLabel>Friend Requests {friendRequestsCount===0 ? '' : <IonBadge  color="danger" slot="end">{friendRequestsCount}</IonBadge> }</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <IonContent>
          <IonList lines='full'>
            {friendList.map((item) => <FriendItem key={item.id} item={item} />)}
          </IonList>
        </IonContent>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton  onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonModal isOpen={showModal} cssClass='add-friend-modal'>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Add a freind</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>
                  <IonIcon name="close" slot="icon-only"/>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
            <IonSearchbar onIonChange={e => {
              setsearchQuery(e.detail.value);
            }}/>
          <IonContent id="search_results">
            <IonList lines='full'>
              <IonRadioGroup value={selectedFriend} onIonChange={e => setSelectedFriend(e.detail.value)}>
              {friendSearchList.map((item) =>
                  <IonItem key={item.id}>
                    <IonAvatar className="friend-avatar">
                      <img src={'https://image.tmdb.org/t/p/w200' + item.icon} alt="" />
                    </IonAvatar>
                    <IonLabel>{item.username} ({item.name})</IonLabel>
                    <IonRadio
                        name="friend"
                        color="primary"
                        value={item.id}
                    />
                  </IonItem>
              )}
              </IonRadioGroup>
            </IonList>
          </IonContent>
          <IonButton onClick={()=>addFriendBtn()}>Add</IonButton>
        </IonModal>
        <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message="Friend request has been sent"
            duration={2500}
            color={'success'}
        />
      </IonContent>
    </IonPage>
  );
};

export default Movies;
