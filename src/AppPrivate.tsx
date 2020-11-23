import Menu from './components/Menu';
import Movies from "./pages/Movies";
import MyMovies from './pages/MyMovies';
import Friend from './pages/Friend';
import Groups from './pages/Groups';
import Friends from "./pages/Friends";
import AccountSettings from './pages/AccountSettings';
import React, {useEffect} from 'react';
import {IonRouterOutlet, IonSplitPane} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {getCurrentUser, useAuth} from "./auth";
import Top10 from "./pages/Top10";
import {RootDispatcher, StateProps} from './store/reducer';
import { useDispatch, useSelector } from "react-redux"

const App: React.FC = () => {

    const loggedIn = useAuth();
    const dispatch = useDispatch();
    const rootDispatcher = new RootDispatcher(dispatch);

    const indicators = useSelector<StateProps>((state: StateProps) => {
        return state.indicators
    });


    useEffect(()=>{

        const socket = new WebSocket('ws://138.197.181.62:8080/' + getCurrentUser().uid);
        let st = false;
        // socket.onopen = function() {
        //     console.log('Opened connection');
        // }
        socket.onmessage = function(event) {
            const result = JSON.parse(event.data).result;
            if(result.menu && !st){
                st = true
                rootDispatcher.updateIndicators(result)
            }
            else if(!result.menu && st){
                st = false
                rootDispatcher.updateIndicators(result)
            }
        }

    },[]); // eslint-disable-line react-hooks/exhaustive-deps


    if(!loggedIn.loggedIn){
    return <Redirect to="/register"/>
    }
    return (
      <IonSplitPane contentId="main">
        <Menu />
        { indicators.menu ? <span className={"mm-indicator"} /> : '' }
        <IonRouterOutlet id="main">
            <Route path="/my/movies/" component={Movies} exact />
            <Route path="/my/movies/view/:status" component={MyMovies} exact />
            <Route path="/my/friends" component={Friends} exact />
            <Route path="/my/friend/:id" component={Friend} exact />
            <Route path="/my/top10" component={Top10} exact />
            <Route path="/my/groups" component={Groups} exact />
            <Route path="/my/account" component={AccountSettings} exact />
            <Redirect from="/my" to="/my/movies" exact />
        </IonRouterOutlet>
      </IonSplitPane>
    );
};

export default App;
