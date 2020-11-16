import {
  IonAvatar, IonBadge,
  IonButton, IonButtons,
  IonContent,
  IonIcon, IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote, IonPopover,
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import {
  filmOutline,
  filmSharp,
  peopleOutline,
  peopleSharp,
  peopleCircleSharp,
  peopleCircleOutline,
  heartSharp,
  heartOutline,
  heartDislikeSharp,
  heartDislikeOutline,
  settingsOutline,
  settingsSharp, qrCodeSharp, ribbonOutline, ribbonSharp
} from 'ionicons/icons';
import './Menu.css';
import {auth} from '../firebase';
import {getMenuCounts} from "./Api";
import {getCurrentUser} from "../auth";
import {RootDispatcher, StateProps} from '../store/reducer';
import { useDispatch, useSelector } from "react-redux"

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  badge: number;
}

const Menu: React.FC = () => {

  const location = useLocation();
  //const [ userInfo, setUserInfo ] = useState({username:'',name:'',photo:'',qr:''});
  const [friendsCount, setFriendsCount] = useState(-1)
  const [likedCount, setLikedCount] = useState(-1)
  const [dislikedCount, setDisLikedCount] = useState(-1)
  const [qrImage, setQrImage] = useState(false)

  const appPages: AppPage[] = [
    {
      title: 'Movies',
      url: '/my/movies',
      iosIcon: filmOutline,
      mdIcon: filmSharp,
      badge: -1
    },
    {
      title: 'Friends',
      url: '/my/friends',
      iosIcon: peopleOutline,
      mdIcon: peopleSharp,
      badge: friendsCount
    },
    {
      title: 'Groups',
      url: '/my/groups',
      iosIcon: peopleCircleOutline,
      mdIcon: peopleCircleSharp,
      badge: -1
    },
    {
      title: 'Top 10',
      url: '/my/top10',
      iosIcon: ribbonOutline,
      mdIcon: ribbonSharp,
      badge: -1
    },
    {
      title: 'Liked movies',
      url: '/my/movies/view/liked',
      iosIcon: heartOutline,
      mdIcon: heartSharp,
      badge: likedCount
    },
    {
      title: 'Disliked movies',
      url: '/my/movies/view/disliked',
      iosIcon: heartDislikeOutline,
      mdIcon: heartDislikeSharp,
      badge: dislikedCount
    },
    {
      title: 'Account Settings',
      url: '/my/account',
      iosIcon: settingsOutline,
      mdIcon: settingsSharp,
      badge: -1
    }
  ];

  const dispatch = useDispatch();

  const menu = useSelector<StateProps>((state: StateProps) => {
    return state.menu
  });

  const userInfo = useSelector<StateProps>((state: StateProps) => {
    return state.user
  });

  useEffect(()=>{
    const updateMenu = () => {
      getMenuCounts(getCurrentUser().uid).then((mc:{disliked: number, friends: number, liked: number})=>{
        const rootDispatcher = new RootDispatcher(dispatch);
        rootDispatcher.updateMenu({disliked: mc.disliked, friends: mc.friends, liked: mc.liked})})
    }
    updateMenu();
  },[dispatch]);

  useEffect(() => {
    setFriendsCount(menu.friends)
    setLikedCount(menu.liked)
    setDisLikedCount(menu.disliked)
  },[menu]);

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">

          <IonAvatar className="menu-avatar">
            <IonImg src={userInfo?.photo} alt="" />
          </IonAvatar>
          <IonListHeader className="menu-list-header">{userInfo?.username}</IonListHeader>
          <IonNote className="menu-note">{userInfo?.name ? userInfo?.name : getCurrentUser().email }</IonNote>
          <IonButtons slot="end" className={"qr-img-btn"}>
            <IonButton onClick={() => {setQrImage(true)}}>
              <IonIcon icon={qrCodeSharp} slot="icon-only"/>
            </IonButton>
          </IonButtons>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                  {(()=>{
                    if(appPage.badge !== -1){
                      return <IonBadge  color="medium" slot="end">{appPage.badge}</IonBadge>
                    }
                  })()}
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
        <IonButton color="medium"
                   expand="block"
                   onClick={ () => auth.signOut() }
        >Logout</IonButton>
        <IonPopover
            isOpen={qrImage}
            animated={true}
            cssClass='qr-img-container'
            onDidDismiss={e => {setQrImage(false)}}
        >
          <IonImg src={userInfo?.qr} alt="" />
          <IonButton expand="full" onClick={() => {setQrImage(false)}}>Close</IonButton>
        </IonPopover>

      </IonContent>
    </IonMenu>
  );
};

export default Menu;
