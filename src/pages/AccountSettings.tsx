import {
    IonButtons,
    IonCard, IonCardContent,
    IonCardHeader, IonCardTitle,
    IonContent,
    IonHeader, IonItem, IonLabel, IonList,
    IonMenuButton,
    IonPage,
    IonTitle, IonToggle,
    IonToolbar,
    IonInput, IonDatetime, IonButton, IonIcon, IonAlert
} from '@ionic/react';
import React, {useState} from 'react';
import './Page.css';
import {useDispatch, useSelector} from "react-redux";
import {RootDispatcher, StateProps} from "../store/reducer";
import {Plugins} from "@capacitor/core";
import {deleteAccount, updateBirthday, updateName, updateUsername} from "../components/Api";
import {checkmark, close} from "ionicons/icons";
import {getCurrentUser} from "../auth";
import {auth} from "../firebase";

const Movies: React.FC = () => {

    const { Storage } = Plugins;

    const dispatch = useDispatch();
    const rootDispatcher = new RootDispatcher(dispatch);
    const [usernameIcon, setUsernameIcon] = useState({icon: '', color: ''});
    const [showAlert, setShowAlert] = useState(false);
    const {user} = useSelector<StateProps>((state: StateProps) => {
        return state
    });


    const {settings} = useSelector<StateProps>((state: StateProps) => {
        return state
    });

    const saveSlides = (val) => {
        let sett = {...settings, slides:val}
        saveSettings(sett)
    }

    const saveButtons = (val) => {
        let sett = {...settings, buttons:val}
        saveSettings(sett)
    }

    function saveSettings(settings){
        rootDispatcher.updateSettings(settings)
        Storage.set({
            key: 'settings',
            value: JSON.stringify(settings)
        }).then();
    }

    function saveUsernameHandler(value){
        user.username = value;
        if(value.length > 3){
            updateUsername(getCurrentUser().uid, value).then((res)=>{
                if(res.error === 0){
                    rootDispatcher.updateUser(user);
                    setUsernameIcon({icon: checkmark, color: 'success'});
                }
                else{
                    setUsernameIcon({icon: close, color: 'danger'});
                }
            })
        }
        else{
            setUsernameIcon({icon: close, color: 'danger'});
        }
    }

    function saveNameHandler(value){
        user.name = value;
        updateName(getCurrentUser().uid, value).then((res)=>{
            if(res.error === 0){
                rootDispatcher.updateUser(user);
            }
        })
    }

    function saveBirthdayHandler(value){
        user.birthday = value;
        updateBirthday(getCurrentUser().uid, value).then((res)=>{
            if(res.error === 0){
                rootDispatcher.updateUser(user);
            }
        })
    }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Account Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
          <IonCard>
              <IonCardHeader>
                  <IonCardTitle>
                      <IonCardTitle>Settings</IonCardTitle>
                      <IonCardContent>
                          <IonList lines='full'>
                              <IonItem key={1}>
                                  <IonLabel>Show Swipe indicators</IonLabel>
                                  <IonToggle
                                      checked={settings.slides}
                                      onIonChange={e => saveSlides(e.detail.checked) }
                                      color="primary"
                                  />
                              </IonItem>
                              <IonItem key={2}>
                                  <IonLabel>Show Like / Dislike buttons</IonLabel>
                                  <IonToggle
                                      checked={settings.buttons}
                                      onIonChange={e => saveButtons(e.detail.checked) }
                                      color="primary"
                                  />
                              </IonItem>
                          </IonList>
                      </IonCardContent>
                  </IonCardTitle>
              </IonCardHeader>
          </IonCard>
          <IonCard>
              <IonCardHeader>
                  <IonCardTitle>
                      <IonCardTitle>Account</IonCardTitle>
                      <IonCardContent>
                          <IonList lines='full'>
                              <IonItem key={1}>
                                  <IonLabel>Username</IonLabel>
                                  <IonInput slot={"end"} placeholder="Enter username" value={user.username} onIonChange={(e)=>saveUsernameHandler(e.detail.value!)} />
                                  <IonIcon icon={usernameIcon.icon} slot={"end"} color={usernameIcon.color} />
                              </IonItem>
                              <IonItem key={2}>
                                  <IonLabel>Name</IonLabel>
                                  <IonInput slot={"end"} placeholder="Enter Name" value={user?.name}  onIonChange={(e)=>saveNameHandler(e.detail.value!)} />
                                  <IonIcon slot={"end"} />
                              </IonItem>
                              <IonItem key={3}>
                                  <IonLabel>Birthday</IonLabel>
                                  <IonDatetime displayFormat="MMM D, YYYY" placeholder={"Jan 01, 2000"} value={user?.birthday ? user?.birthday : '' } onIonChange={(e)=>saveBirthdayHandler(e.detail.value!)}/>
                                  <IonIcon slot={"end"} />
                              </IonItem>
                              <IonItem key={4}>
                                  <IonLabel>Delete Account</IonLabel>
                                  <IonButton color="light"  onClick={() => setShowAlert(true)}>Delete</IonButton>
                              </IonItem>
                          </IonList>
                      </IonCardContent>
                  </IonCardTitle>
              </IonCardHeader>
          </IonCard>
          <IonAlert
              isOpen={showAlert}
              onDidDismiss={() => setShowAlert(false)}
              header={'Are you sure?'}
              message={'If you delete your account, it will be completed within <strong>5</strong> days'}
              buttons={[
                  {
                      text: 'Cancel',
                      role: 'cancel',
                      cssClass: 'secondary'
                  },
                  {
                      text: 'Delete',
                      handler: () => {
                          deleteAccount(getCurrentUser().uid).then((res)=>{
                              if(res.error === 0){
                                  auth.signOut().then(()=>{
                                      window.location.href = "/login"
                                  })
                              }
                          })
                      }
                  }
              ]}
          />
      </IonContent>
    </IonPage>
  );
};

export default Movies;
