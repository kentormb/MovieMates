import Menu from './components/Menu';
import Movies from "./pages/Movies";
import MyMovies from './pages/MyMovies';
import Friend from './pages/Friend';
import Groups from './pages/Groups';
import Friends from "./pages/Friends";
import AccountSettings from './pages/AccountSettings';
import React from 'react';
import {IonRouterOutlet, IonSplitPane} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {useAuth} from "./auth";
// import { Dispatch } from "redux"
// import { useDispatch, useSelector } from "react-redux"
// import {StateProps} from './store/reducer';

const App: React.FC = () => {

    const loggedIn = useAuth();

    // const cnt = useSelector<StateProps>((state: StateProps) => {
    //   return state
    // });
    //
    // const dispatch: Dispatch<any> = useDispatch()
    //
    // const updateMenu = React.useCallback(
    //     () => dispatch({type: 'UPDATE_MENU', payload: {disliked: 1, friends: 2, liked: 3}}),
    //     []
    // )
    //
    // let int =  setInterval(() => {
    //   console.log("Hello", cnt);
    //   //updateMenu()
    //   }, 10000);

    if(!loggedIn.loggedIn){
    return <Redirect to="/register"/>
    }
    return (
      <IonSplitPane contentId="main">
        <Menu />
        <IonRouterOutlet id="main">
            <Route path="/my/movies/" component={Movies} exact />
            <Route path="/my/movies/view/:status" component={MyMovies} exact />
            <Route path="/my/friends" component={Friends} exact />
            <Route path="/my/friend/:id" component={Friend} exact />
            <Route path="/my/groups" component={Groups} exact />
            <Route path="/my/account" component={AccountSettings} exact />
            <Redirect from="/my" to="/my/movies" exact />
        </IonRouterOutlet>
      </IonSplitPane>
    );
};

export default App;
