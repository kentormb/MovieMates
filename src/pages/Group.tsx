import {
    IonAvatar,
    IonBackButton, IonBadge, IonButton,
    IonButtons, IonCheckbox,
    IonContent,
    IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonItemSliding, IonLabel, IonList, IonModal,
    IonPage, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonSlide, IonSlides,
    IonTitle,
    IonToolbar, useIonViewWillEnter
} from '@ionic/react';
import React, {useRef, useState} from 'react';
import { useParams } from 'react-router';
import './Page.css';
import MatchedMovies from '../components/MatchedMovies';
import {deleteGroup, getGroupById, deleteGroupUser, addGroupFriends, getFriends, saveGroup} from "../components/Api";
import {trashOutline, trashSharp} from "ionicons/icons";
import { useHistory } from 'react-router-dom';
import {getCurrentUser} from "../auth";
import {RefresherEventDetail} from "@ionic/core";
import {RootDispatcher} from "../store/reducer";
import { useDispatch } from "react-redux"


const Group: React.FC = () => {
    const { id } = useParams();
    const history = useHistory();
    const [group, setGroup] = useState({groupName: '', id: ''});
    const [users, setUsers] = useState([]);
    const slider = useRef<HTMLIonSlidesElement>(null);
    const [value, setValue] = useState("0");
    const [isCreator, setIsCreator] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const dispatch = useDispatch();
    const rootDispatcher = new RootDispatcher(dispatch);

    const handleSegmentChange = (e: any) => {
        setValue(e.detail.value);
        slider.current!.slideTo(e.detail.value);
    };

    const handleSlideChange = async (event: any) => {
        let index: number = 0;
        await event.target.getActiveIndex().then((value: any) => (index=value));
        setValue(''+index)
    }
    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        getData()
        event.detail.complete()
    }
    function getData(){
        getGroupById(getCurrentUser().uid, id).then(res =>{
            console.log(res)
            if(res.error === 0){
                setIsCreator(res.results.isCreator);
                if(res.results.group.length){
                    setGroup(res.results.group[0]);
                }
                if(res.results.users.length){
                    setSelectedFriends([]);
                    setUsers(res.results.users);
                }
            }
        })
    }
    function saveGroupHandler(){
        if(selectedFriends.length !== 0){
            addGroupFriends(getCurrentUser().uid, +group.id, selectedFriends.join()).then((res)=>{
                getData();
                setSelectedFriends([]);
            });
        }
        setShowModal(false);
    }
    async function getUserFriends(){
        await getFriends(getCurrentUser().uid, 1).then((results)=>{
            setFriendList(results.error === 0 ? results.result.filter((item)=>item.status===1) : []);
        })
    }
    function selectFriend(val){
        let f = [...selectedFriends];
        val.checked ? f.push(val.value) : f = f.filter(i => i !== val.value );
        setSelectedFriends(f)
    }
    function dismissSearchModal(){
        setShowModal(false);
    }
    function deleteGroupHandle(id: number) {
        deleteGroup(getCurrentUser().uid, id).then(()=>{
            history.goBack()
        })
    }
    function removeUserFromGroup(fid){
        deleteGroupUser(getCurrentUser().uid, id, fid).then(()=>{
            const u = users.filter((user)=>user.id !== fid);
            setUsers(u);
        })
    }

    useIonViewWillEnter(()=>{
        getData();
    });

  return (
      <IonPage>
          <IonHeader>
              <IonToolbar>
                  <IonButtons slot="start">
                      <IonBackButton />
                  </IonButtons>
                  <IonTitle>{group.groupName}</IonTitle>
                  <IonButton  slot="end" onClick={ () => { deleteGroupHandle(id) }} color="medium">
                      <IonIcon ios={trashSharp} md={trashOutline}/>
                  </IonButton>
              </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
              <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                  <IonRefresherContent/>
              </IonRefresher>
              <IonSegment value={value} onIonChange={(e) => handleSegmentChange(e)} >
                  <IonSegmentButton value="0" >
                      <IonLabel>Movies</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="1">
                      <IonLabel>Friends</IonLabel>
                  </IonSegmentButton>
              </IonSegment>
              <IonContent>
                  <IonSlides onIonSlideDidChange={(e) => handleSlideChange(e)} ref={slider}>
                      <IonSlide>
                          {users.length ? <MatchedMovies id={id} isGroup={true} /> : ''}
                      </IonSlide>
                      <IonSlide>
                          <IonList className={"mm-list"}>
                              {users.map((item) =>
                                  <IonItem key={item.id} class='mm-request mm-item' >
                                      <IonAvatar className="friend-avatar">
                                          <img src={item.icon} alt=''/>
                                      </IonAvatar>
                                      <IonLabel>{item.username} {item.name!=='' ? '(' + item.name + ')' : ''}</IonLabel>
                                      {isCreator ? <IonIcon onClick={()=>{removeUserFromGroup(item.id)}} size="medium" ios={trashSharp} md={trashOutline}/> : ''}
                                  </IonItem>
                              )}
                              {isCreator ?
                                  <IonItem  key={0} class='mm-request mm-item'>
                                      <IonButton expand="full" className={'add-friends-button'} onClick={()=> getUserFriends().then(r => {setShowModal(true)})}>Add Friend</IonButton>
                                  </IonItem>
                             : '' }
                          </IonList>
                      </IonSlide>
                  </IonSlides>
              </IonContent>
              <IonModal isOpen={showModal} cssClass='add-friend-modal'>
                  <IonHeader>
                      <IonToolbar color="primary">
                          <IonTitle>Add friends to group {group.groupName}</IonTitle>
                          <IonButtons slot="end">
                              <IonButton onClick={() => dismissSearchModal()}>
                                  <IonIcon icon="close" slot="icon-only"/>
                              </IonButton>
                          </IonButtons>
                      </IonToolbar>
                  </IonHeader>
                  <IonContent>
                      <IonList>
                          {friendList.map((item) =>
                            users.filter(u => u.id === item.id).length === 0 ?
                                  <IonItem key={item.id}>
                                      <IonAvatar className="friend-avatar">
                                          <img src={item.icon} alt="" />
                                      </IonAvatar>
                                      <IonLabel>{item.username} {item.name!=='' ? '(' + item.name + ')' : ''}</IonLabel>
                                      <IonCheckbox slot="end" color="primary" value={item.id} onIonChange={(val)=>selectFriend(val.detail)} />
                                  </IonItem> : ''

                          )}
                      </IonList>
                  </IonContent>
                  <IonButton onClick={()=>saveGroupHandler()}>Save</IonButton>
              </IonModal>
          </IonContent>
      </IonPage>
  );
};

export default Group;
