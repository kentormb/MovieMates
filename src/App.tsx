import Login from './pages/Login';
import Register from "./pages/Register";
import AppPrivate from './AppPrivate';
import React, {useEffect} from 'react';
import {IonApp, IonLoading, IonRouterOutlet} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import {AuthContext, useAuthInit} from './auth';
import {initialState, RootDispatcher} from './store/reducer';
import { useDispatch } from "react-redux"
import {Plugins} from "@capacitor/core";
import Reset from "./pages/Reset";


const App: React.FC = () => {

  const {loading,auth} = useAuthInit();

  const { Storage } = Plugins;

  const dispatch = useDispatch();
  const rootDispatcher = new RootDispatcher(dispatch);

  Storage.get({ key: 'darkMode' }).then((result)=>{
    let darkMode = initialState.darkMode;
    if(result.value){
      darkMode = JSON.parse(result.value);
      rootDispatcher.updateDarkMode(JSON.parse(result.value))
    }
    document.body.classList.toggle('dark', darkMode);
  });
  Storage.get({ key: 'settings' }).then((result)=>{
    if(result.value){
      rootDispatcher.updateSettings(JSON.parse(result.value))
    }
  });

  const backButton = (ev) => {
    ev.preventDefault()
    if(window.history.back() !== undefined){
      window.history.back()
    }
    else{
      window.location.href = '/my/movies'
    }
  }

  useEffect(()=>{
    document.removeEventListener('ionBackButton', backButton, false);
    document.addEventListener('ionBackButton', backButton, false);
  },[]);

  if(loading){
    return (<IonLoading isOpen />);
  }
  return (
    <IonApp>
      <AuthContext.Provider value={auth}>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/resetpassword">
              <Reset />
            </Route>
            <Route path="/my">
              <AppPrivate />
            </Route>
            <Redirect from="/" to="/login" exact />
          </IonRouterOutlet>
        </IonReactRouter>
      </AuthContext.Provider>
    </IonApp>
  );
};

export default App;
