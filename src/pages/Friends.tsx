import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem, IonItemOption, IonItemOptions, IonItemSliding,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton, IonSlide,
  IonSlides,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import React, {useEffect, useRef, useState} from 'react';
import './Page.css';
import {add, trashOutline, trashSharp, qrCodeSharp} from "ionicons/icons";
import {getCurrentUser} from "../auth";
import {addFriend, searchFriend, getFriends, acceptFriendRequest, deleteFriend, getMenuCounts} from '../components/Api'
import { RefresherEventDetail } from '@ionic/core';
import QrReader from 'react-qr-reader';
import {RootDispatcher} from "../store/reducer";
import { useDispatch } from "react-redux"
// https://morioh.com/p/9845cd2a2b19

const Friends: React.FC = () => {

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [friendList, setFriendList] = useState([]);
  const [reqFriendList, setReqFriendList] = useState([]);
  const [friendSearchList, setFriendSearchList] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(0);
  const slider = useRef<HTMLIonSlidesElement>(null);
  const [value, setValue] = useState("0");
  const [qrScanner, setQrScanner] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const dispatch = useDispatch();
  const rootDispatcher = new RootDispatcher(dispatch);

  function dismissSearchModal(){
    setShowModal(false);
    setSelectedFriend(0);
    setFriendSearchList([]);
    setQrScanner(false);
  }

  function acceptRequest(fid:number, status: boolean = true, key: number){
    acceptFriendRequest(getCurrentUser().uid, fid,status,).then((result)=>{
      if(result.error === 0){
        setFriendList(friendList.concat(reqFriendList.filter(item => item.id === key )))
        setReqFriendList(reqFriendList.filter(item => item.id !== key))
        rootDispatcher.incFriendsCount()
      }
    })
  }

  function deleteFriendHandle(id: number, key: number) {
    deleteFriend(getCurrentUser().uid, id).then(()=>{
      rootDispatcher.decFriendsCount()
    })
  }

  const handleSegmentChange = (e: any) => {
    setValue(e.detail.value);
    slider.current!.slideTo(e.detail.value);
  };

  const handleSlideChange = async (event: any) => {
    let index: number = 0;
    await event.target.getActiveIndex().then((value: any) => (index=value));
    setValue(''+index)
  }

  const handleScan = data => {
    if (data) {
      setSearchQuery(data);
      setQrScanner(false);
    }
  }

  const handleError = err => {
    console.error(err)
  }

  async function getUserFriends(fstatus:number = 3){
    await getFriends(getCurrentUser().uid,fstatus).then((results)=>{
      if(results.error === 0){
        setFriendList(results.result.filter((item)=>item.status===1))
        setReqFriendList(results.result.filter((item)=>item.status===0))
        rootDispatcher.updateFriends(results.result.filter((item)=>item.status===1))
      }
      else{
        setFriendList([])
      }
    })
  }

  function addFriendBtn(){
    if(selectedFriend !== 0) {
      addFriend(getCurrentUser().uid, selectedFriend).then((result) => {
        setSelectedFriend(0);
        setShowToast(true);
        setShowModal(false);
        setFriendSearchList([]);
      });
    }
    else{
      setShowErrorToast(true)
    }
  }

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    getUserFriends().then(()=>{
      getMenuCounts(getCurrentUser().uid).then((mc:{disliked: number, friends: number, groups: number, liked: number, suggestions: number})=>{
        rootDispatcher.updateMenu({disliked: mc.disliked, friends: mc.friends, groups: mc.groups, liked: mc.liked, suggestions: mc.suggestions})})
      event.detail.complete()
    })
  }

  useIonViewWillEnter(() => {
    getUserFriends(3).then();
  });

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
        <IonSegment value={value} onIonChange={(e) => handleSegmentChange(e)} >
          <IonSegmentButton value="0" >
            <IonLabel>Friends</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="1">
            <IonLabel>Friend Requests {reqFriendList.length===0 ? '' : <IonBadge  color="danger" slot="end">{reqFriendList.length}</IonBadge> }</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <IonContent>
          <IonSlides onIonSlideDidChange={(e) => handleSlideChange(e)} ref={slider}>
            <IonSlide>
              <IonList className={"mm-list"}>
                {friendList.map((item) =>
                  <IonItem key={item.id} class='mm-friend mm-item' button routerLink={'/my/friend/' + item.id}>
                    <IonAvatar className="friend-avatar">
                      <img src={item.icon} alt=''/>
                    </IonAvatar>
                    <IonLabel>{item.username} {item.name!=='' && item.name!==null ? '(' + item.name + ')' : ''}</IonLabel>
                    {item.matches !== 0 ? <span className={"friends-matches-badge"}>{item.matches}</span> : ''}
                  </IonItem>
                )}
              </IonList>
            </IonSlide>
            <IonSlide>
              <IonList className={"mm-list"}>
                {reqFriendList.map((item) =>
                    <IonItemSliding key={item.id}>
                      <IonItem key={item.id} class='mm-request mm-item' >
                        <IonAvatar className="friend-avatar">
                          <img src={item.icon} alt=''/>
                        </IonAvatar>
                        <IonLabel>{item.username} {item.name!=='' ? '(' + item.name + ')' : ''}</IonLabel>
                        <IonButton onClick={ () => acceptRequest(item.fid,true, item.id)} color="success">Accept</IonButton>
                      </IonItem>
                      <IonItemOptions side="end">
                        <IonItemOption color="danger" expandable onClick={ () => { deleteFriendHandle(item.id, item.id) }} >
                          <IonIcon size="large" ios={trashSharp} md={trashOutline}/>
                        </IonItemOption>
                      </IonItemOptions>
                    </IonItemSliding>)}
              </IonList>
            </IonSlide>
          </IonSlides>
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
                <IonButton onClick={() => {setQrScanner(!qrScanner)}}>
                  <IonIcon icon={qrCodeSharp} slot="icon-only"/>
                </IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton onClick={() => dismissSearchModal()}>
                  <IonIcon icon="close" slot="icon-only"/>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
            <IonSearchbar onIonChange={e => {
              setSearchQuery(e.detail.value);
            }}/>
          <IonContent id="search_results">
            {qrScanner ? <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
            />:''}
            <IonList lines='full'>
              <IonRadioGroup value={selectedFriend} onIonChange={e => setSelectedFriend(e.detail.value)}>
              {friendSearchList.map((item) =>
                  <IonItem key={item.id}>
                    <IonAvatar className="friend-avatar">
                      <img src={item.icon} alt="" />
                    </IonAvatar>
                    <IonLabel>{item.username} {item.name!=='' ? '(' + item.name + ')' : ''}</IonLabel>
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
        <IonToast
            isOpen={showErrorToast}
            onDidDismiss={() => setShowErrorToast(false)}
            message="You have not selected any friends"
            duration={2500}
            color={'danger'}
        />
      </IonContent>
    </IonPage>
  );
};

export default Friends;
