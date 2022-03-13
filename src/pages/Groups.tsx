import {
    IonAvatar,
    IonButton,
    IonButtons,
    IonCard, IonCheckbox,
    IonContent, IonFab, IonFabButton,
    IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList,
    IonMenuButton, IonModal,
    IonPage, IonRefresher, IonRefresherContent,
    IonTitle, IonToast,
    IonToolbar, useIonViewWillEnter
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import './Page.css';
import {add} from "ionicons/icons";
import {getFriends, saveGroup, getGroups, searchFriend, getMenuCounts} from "../components/Api";
import {getCurrentUser} from "../auth";
import {RefresherEventDetail} from "@ionic/core";
import {RootDispatcher} from "../store/reducer";
import { useDispatch } from "react-redux"

const Groups: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [friendList, setFriendList] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [groups, setGroups] =  useState([]);
    const dispatch = useDispatch();
    const rootDispatcher = new RootDispatcher(dispatch);

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        getData()
        event.detail.complete()
    }
    function getData(){
        getGroups(getCurrentUser().uid).then(groups=>{
            setGroups(groups.results)
        })
    }
    function createGroup(){
        getUserFriends().then(r => {});
        setSelectedFriends([]);
        setGroupName('');
        setShowModal(true);
    }
    function saveGroupHandler(){
        if(!groupName){
            setToastMessage('Group name is empty');
            setToastType('danger');
        }
        else{
            setToastMessage('Group has been saved');
            setToastType('success');
            saveGroup(getCurrentUser().uid, groupName, selectedFriends.join()).then((res)=>{
                getData();
                setShowModal(false);
            });
        }
        setShowToast(true);
    }
    function setText(param) {
        setGroupName(param);
    }
    function selectFriend(val){
        let f = [...selectedFriends];
        val.checked ? f.push(val.value) : f = f.filter(i => i !== val.value );
        setSelectedFriends(f)
    }
    function dismissSearchModal(){
        setGroupName('');
        setShowModal(false);
    }
    async function getUserFriends(){
        await getFriends(getCurrentUser().uid, 1).then((results)=>{
            setFriendList(results.error === 0 ? results.result.filter((item)=>item.status===1) : []);
        })
    }

    useIonViewWillEnter(() => {
        getData();
    },[])

    return (
        <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton />
                </IonButtons>
              <IonTitle>Groups</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                <IonRefresherContent/>
            </IonRefresher>
            <IonCard>
                <IonList>
                    {groups.map((item) =>
                        <IonItem key={item.id} routerLink={'/my/group/' + item.id} className={!item.isCreator ? 'not-my-group-item' : ''}>
                            <IonLabel>{item.groupName} ({item.group_count + (!item.isCreator)})</IonLabel>
                        </IonItem>
                    )}
                </IonList>
            </IonCard>
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton  onClick={() => createGroup()}>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
            <IonModal isOpen={showModal} cssClass='add-friend-modal'>
                <IonHeader>
                    <IonToolbar color="primary">
                        <IonTitle>Create a group</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => dismissSearchModal()}>
                                <IonIcon icon="close" slot="icon-only"/>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonList>
                    <IonItem>
                        <IonInput value={groupName} placeholder="Enter group name" onIonChange={e => setText(e.detail.value!)} />
                    </IonItem>
                </IonList>
                <IonItemDivider>Add Friends to { groupName ? 'group ' + groupName : 'this group'}</IonItemDivider>
                <IonContent>
                    <IonList>
                        {friendList.map((item) =>
                            <IonItem key={item.id}>
                                <IonAvatar className="friend-avatar">
                                    <img src={item.icon} alt="" />
                                </IonAvatar>
                                <IonLabel>{item.username} {item.name!=='' ? '(' + item.name + ')' : ''}</IonLabel>
                                <IonCheckbox slot="end" color="primary" value={item.id} onIonChange={(val)=>selectFriend(val.detail)} />
                            </IonItem>
                        )}
                    </IonList>
                </IonContent>
                <IonButton onClick={()=>saveGroupHandler()}>Save</IonButton>
            </IonModal>
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2500}
                color={toastType}
            />
        </IonContent>
    </IonPage>
    );
};

export default Groups;
