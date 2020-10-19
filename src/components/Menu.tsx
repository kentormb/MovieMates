import {
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
import React from 'react';
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
import { auth } from '../firebase';
import { useAuth } from '../auth';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Movies',
    url: '/my/movies',
    iosIcon: filmOutline,
    mdIcon: filmSharp
  },
  {
    title: 'Friends',
    url: '/my/friends',
    iosIcon: peopleOutline,
    mdIcon: peopleSharp
  },
  {
    title: 'Groups',
    url: '/my/groups',
    iosIcon: peopleCircleOutline,
    mdIcon: peopleCircleSharp
  },
  {
    title: 'Liked movies',
    url: '/my/movies/liked',
    iosIcon: heartOutline,
    mdIcon: heartSharp
  },
  {
    title: 'Disliked movies',
    url: '/my/movies/disliked',
    iosIcon: heartDislikeOutline,
    mdIcon: heartDislikeSharp
  },
  {
    title: 'Account Settings',
    url: '/my/account',
    iosIcon: settingsOutline,
    mdIcon: settingsSharp
  }
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>{useAuth().userEmail}</IonListHeader>
          <IonNote>this is a status</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
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
