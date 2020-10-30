import {
    IonAvatar,
    IonBadge,
    IonButton,
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel, IonList
} from "@ionic/react";
import React, {useContext} from "react";
import {acceptFriendRequest, deleteFriend} from "./Api";
import {trashOutline, trashSharp} from "ionicons/icons";
import {AppContext} from "../State";
import {getCurrentUser} from "../auth";

interface Prop{
    item: {status:number,username:string,fid:number,id:number,icon:string,name:string};
    key: number;
}

function deleteFriendHandle(id: number) {
    deleteFriend(getCurrentUser().uid, id).then(()=>{
        //TODO remove user from list
    })
}

const FriendItem: React.FC<Prop> = ({item},key) => {
    const { state, dispatch } = useContext(AppContext);

    function acceptRequest(fid:number, status: boolean = true){
        acceptFriendRequest(fid,status).then((result)=>{

            if(result.error === 0){
                dispatch({
                    type: 'setCount',
                    count: state.count + 1
                })
            }
        })
    }

    if(item.status === 1){
        return (

            <IonItemSliding>
                <IonItem key={key} class='mm-friend mm-item' button routerLink={'/my/friend/' + item.id}>
                    <IonAvatar className="friend-avatar">
                        <img src={'https://image.tmdb.org/t/p/w200' + item.icon} alt=''/>
                    </IonAvatar>
                    <IonLabel>{item.username} ({item.name})</IonLabel>
                    <IonBadge  color="success" slot="end">0</IonBadge>
                </IonItem>
                <IonItemOptions side="end">
                    <IonItemOption color="danger" expandable onClick={ () => { deleteFriendHandle(item.id) }}>
                        <IonIcon size="large" ios={trashSharp} md={trashOutline}/>
                    </IonItemOption>
                </IonItemOptions>
            </IonItemSliding>
        )
    }
    else{
        return (
            <IonItemSliding>
                <IonItem key={key} class='mm-request mm-item' >
                    <IonAvatar className="friend-avatar">
                        <img src={'https://image.tmdb.org/t/p/w200' + item.icon} alt=''/>
                    </IonAvatar>
                    <IonLabel>{item.username} ({item.name})</IonLabel>
                    <IonButton onClick={ () => acceptRequest(item.fid,true)} color="success">Accept</IonButton>
                </IonItem>
                <IonItemOptions side="end">
                    <IonItemOption color="danger" expandable onClick={ () => { deleteFriendHandle(item.id) }} >
                        <IonIcon size="large" ios={trashSharp} md={trashOutline}/>
                    </IonItemOption>
                </IonItemOptions>
            </IonItemSliding>
        )
    }
}

export default FriendItem;
