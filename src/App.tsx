import Login from './pages/Login';
import Register from "./pages/Register";
import AppPrivate from './AppPrivate';
import React from 'react';
import {IonApp, IonLoading, IonRouterOutlet} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext, useAuthInit } from './auth';

const App: React.FC = () => {

  const {loading,auth} = useAuthInit();

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
            <Route path="/my">
              <AppPrivate />
            </Route>
            <Redirect from="/" to="/my/movies" exact />
          </IonRouterOutlet>
        </IonReactRouter>
      </AuthContext.Provider>
    </IonApp>
  );
};

export default App;
