import Menu from './components/Menu';
import Movies from "./pages/Movies";
import MyMovies from './pages/MyMovies';
import Friend from './pages/Friend';
import Groups from './pages/Groups';
import Group from './pages/Group';
import Friends from "./pages/Friends";
import AccountSettings from './pages/AccountSettings';
import React, {useEffect, useRef, useState} from 'react';
import { IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {getCurrentUser, useAuth} from "./auth";
import Suggestions from "./pages/Suggestions";
import { StateProps, RootDispatcher } from './store/reducer';
import { useSelector, useDispatch } from "react-redux"
import {getIndicators} from "./components/Api";

const App: React.FC = () => {

    const loggedIn = useAuth();
    const [timer, setTimer] = useState(1);
    const dispatch = useDispatch();
    const rootDispatcher = new RootDispatcher(dispatch);

    const indicators = useSelector<StateProps>((state: StateProps) => {
        return state.indicators
    });

    useInterval(() => {
        getIndicators(getCurrentUser().uid).then((result) => {
            //console.log(result);
            rootDispatcher.updateIndicators(result)
        });
    }, timer > 0 ? 30000 : null);

    function useInterval(callback: any, delay:number|null) {
        const savedCallback = useRef();
        // Remember the latest function.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);
        // Set up the interval.
        useEffect(() => {
            function tick() {
                // @ts-ignore
                savedCallback.current();
            }
            if (delay !== null ) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    if(!loggedIn.loggedIn){
        setTimer(null)
        window.location.href = '/login'
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
            <Route path="/my/suggestions" component={Suggestions} exact />
            <Route path="/my/groups" component={Groups} exact />
            <Route path="/my/group/:id" component={Group} exact />
            <Route path="/my/account" component={AccountSettings} exact />
            <Redirect from="/my" to="/my/movies" exact />
        </IonRouterOutlet>
      </IonSplitPane>
    );
};

export default App;
