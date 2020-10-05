import Menu from './components/Menu';
import Movies from './pages/Movies';
import Matches from './pages/Matches';
import Friends from './pages/Friends';
import Login from './pages/Login';
import React from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

const App: React.FC = () => {

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/movies" component={Movies} exact />
            <Route path="/matches" component={Matches} exact />
            <Route path="/friends" component={Friends} exact />
            <Route path="/login" component={Login} exact />
            <Redirect from="/" to="/movies" exact />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
