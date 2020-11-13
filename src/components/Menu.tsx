import {
  IonAvatar, IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
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
  settingsSharp
} from 'ionicons/icons';
import './Menu.css';
import {auth} from '../firebase';
import {Plugins} from "@capacitor/core";
import {getMenuCounts} from "./Api";
import {getCurrentUser} from "../auth";
import {StateProps} from '../store/reducer';
import { useSelector } from "react-redux"
import {Dispatch} from "redux";
import { useDispatch } from "react-redux"

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  badge: number;
}

const Menu: React.FC = () => {

  const location = useLocation();
  const [ userInfo, setUserInfo ] = useState({username:'',name:'',photo:''});
  const { Storage } = Plugins;

  const [friendsCount, setFriendsCount] = useState(-1)
  const [likedCount, setLikedCount] = useState(-1)
  const [dislikedCount, dissetLikedCount] = useState(-1)

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

  const dispatch: Dispatch<any> = useDispatch();
  const updateMenu = React.useCallback(
      () => {
        getMenuCounts(getCurrentUser().uid).then((mc:{disliked: number, friends: number, liked: number})=>{
          dispatch({
            type: 'UPDATE_MENU',
            payload: {disliked: mc.disliked, friends: mc.friends, liked: mc.liked}
        })
      })},
      []
  );


  const menu = useSelector<StateProps>((state: StateProps) => {
    return state.menu
  });

  useEffect(()=>{
    updateMenu();
  },[]);

  useEffect(() => {
    setFriendsCount(menu.friends)
    setLikedCount(menu.liked)
    dissetLikedCount(menu.disliked)
  },[menu]);

  useEffect(() => {
    //TODO remove timeout
    setTimeout(()=>{
      Storage.get({ key: 'user' }).then((result)=>{
        if(result)
          setUserInfo( JSON.parse(result.value))
      });
    }, 1000)
  },[Storage]);

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">

          <IonAvatar className="menu-avatar">
            <img src={userInfo.photo} alt="" />
          </IonAvatar>
          <IonListHeader className="menu-list-header">{userInfo.username}</IonListHeader>
          <IonNote className="menu-note">{userInfo.name}</IonNote>

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
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
