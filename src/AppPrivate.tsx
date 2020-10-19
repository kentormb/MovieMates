import Menu from './components/Menu';
import Movies from './pages/Movies';
import MyMovies from './pages/MyMovies';
import Friends from './pages/Friends';
import Groups from './pages/Groups';
import AccountSettings from './pages/AccountSettings';
import React from 'react';
import {IonRouterOutlet, IonSplitPane} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {useAuth} from "./auth";

const App: React.FC = () => {

  const loggedIn = useAuth();

  if(!loggedIn.loggedIn){
    return <Redirect to="/register"/>
  }
  return (
      <IonSplitPane contentId="main">
        <Menu />
        <IonRouterOutlet id="main">
            <Route path="/my/movies/" component={Movies} exact />
            <Route path="/my/movies/:status" component={MyMovies} exact />
            <Route path="/my/friends" component={Friends} exact />
            <Route path="/my/groups" component={Groups} exact />
            <Route path="/my/account" component={AccountSettings} exact />
          <Redirect from="/my" to="/my/movies" exact />
        </IonRouterOutlet>
      </IonSplitPane>
  );
};

export default App;
