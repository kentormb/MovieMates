import React, {useEffect, useState} from "react";
import {
    IonContent,
    IonLoading,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem, IonLabel, IonToggle
} from "@ionic/react";
import {Card} from "./Card";
import {getUsersMovies, seenThisMovie, updateUsersMovies} from "./Api";
import {getCurrentUser} from "../auth";
import {RefresherEventDetail} from "@ionic/core";
import {RootDispatcher} from "../store/reducer";
import { useDispatch } from "react-redux"

import '../pages/SelectedMovies.css';

interface Prop{
    status: string | number;
}

const SelectedMovies: React.FC<Prop> = ({status}) => {

    const [isLoaded, setIsLoaded] = useState(false);
    const [pageLikes, setPageLikes] = useState(1);
    const [pageDisLikes, setPageDisLikes] = useState(1);
    const [seenLikes, setSeenLikes] = useState(true);
    const [seenDisLikes, setSeenDisLikes] = useState(true);
    const dispatch = useDispatch();
    const rootDispatcher = new RootDispatcher(dispatch);

    const setWatched = (e) => {
        status === 'liked' ? setSeenLikes(e) : setSeenDisLikes(e);
    }

    async function loadMoreMovies(e){
        const page = status === 'liked' ? pageLikes :pageDisLikes;
        getMovies(page).then(()=>{
            (e.target as HTMLIonInfiniteScrollElement).complete()
            status === 'liked' ? setPageLikes(page+1) : setPageDisLikes(page+1);
        })
    }

    function seenThis(mid,status){
        seenThisMovie(getCurrentUser().uid, mid, status).then(()=>{
            if(status === 1){
                const c = document.querySelector('[key="'+mid+'"]');
                c.className = 'card dis-likes seen';
                const b = c.getElementsByClassName('seen-btn');
                c.removeChild(b[0]);
                const p = c.getElementsByClassName('poster');
                const seen = document.createElement('div');
                seen.setAttribute('class','seen-layer');
                p[0].append(seen);
                const m = c.getElementsByClassName('moreinfo');
                const u = document.createElement('img');
                u.setAttribute('class','unseen-btn');
                u.src = 'assets/icon/unseen.png';
                u.addEventListener('click', () => { seenThis(mid,0) });
                m[0].append(u);

            }
            else{
                const c = document.querySelector('[key="'+mid+'"]');
                c.className = 'card dis-likes';
                const p = c.getElementsByClassName('poster');
                const l = c.getElementsByClassName('seen-layer');
                p[0].removeChild(l[0]);
                const m = c.getElementsByClassName('moreinfo');
                const u = c.getElementsByClassName('unseen-btn');
                m[0].removeChild(u[0]);
                const s = document.createElement('span');
                s.setAttribute('class','seen-btn');
                s.addEventListener('click', () => { seenThis(mid, 1) });
                c.append(s);
                const t = document.createElement('img');
                t.src = 'assets/icon/eye.png';
                s.append(t);
            }
        })
    }

    async function getMovies(page: number = 1){
        const seen = status === 'liked' ? seenLikes : seenDisLikes;
        getUsersMovies(page, getCurrentUser().uid, status === 'liked' ? 1 : 0, seen ).then((results) => {
            setIsLoaded(true);
            try {
                let board = document.querySelector('#selected_board');
                //board.innerHTML = '';
                for (const [index, value] of  Object.entries(results)) {

                    // @ts-ignore
                    const card = Card(+index,value,seenThis);
                    // @ts-ignore
                    card.className = value.seen === 1 ? 'card dis-likes seen' : 'card dis-likes';

                    const action = document.createElement('div');
                    action.setAttribute('class','action');

                    const button = document.createElement('img');

                    if(status === 'liked'){
                        button.src = '/assets/icon/dislike.png';
                        button.setAttribute('class','button liked');
                        button.addEventListener('click', ()=>{
                            // @ts-ignore
                            updateUsersMovies(getCurrentUser().uid, value.movieId,0).then((result)=>{
                                if(result.error === 0){
                                    rootDispatcher.decLiked();
                                    rootDispatcher.incDisLiked();
                                }
                            });
                            card.remove();
                        })
                    }
                    else{
                        button.src = '/assets/icon/like.png';
                        button.setAttribute('class','button disliked');
                        button.addEventListener('click', ()=>{
                            // @ts-ignore
                            updateUsersMovies(getCurrentUser().uid, value.movieId,1).then((result)=>{
                                if(result.error === 0){
                                    rootDispatcher.incLiked();
                                    rootDispatcher.decDisLiked();
                                }
                            });
                            card.remove();
                        })
                    }

                    action.append(button)
                    card.append(action)
                    board.append(card);
                }
            }
            catch (e) {
                setIsLoaded(false);
            }

        });
    }

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        document.querySelector('#selected_board').innerHTML = '';
        status === 'liked' ? setPageLikes(1) : setPageDisLikes(1);
        getMovies().then(()=>{
            event.detail.complete()
            status === 'liked' ? setPageLikes(2) : setPageDisLikes(2);
        })
    }

    useEffect(() => {
        setPageLikes(1);
        setPageDisLikes(1);
        if(document.querySelector('#selected_board')){
            document.querySelector('#selected_board').innerHTML = '';
        }
        getMovies(1).then(()=>{
            setPageLikes(2);
            setPageDisLikes(2);
        });
    },[status, seenLikes, seenDisLikes]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!isLoaded) {
        return (<IonLoading isOpen/>);
    } else {
        return (
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent/>
                </IonRefresher>
                <IonItem>
                    <IonLabel>Show watched movies</IonLabel>
                    <IonToggle checked={ status === 'liked' ? seenLikes : seenDisLikes } onIonChange={e => setWatched(e.detail.checked)} />
                </IonItem>
                <div id="selected_board" className={"selected_board"}/>
                <IonInfiniteScroll threshold="275px"
                                   onIonInfinite={(e) => loadMoreMovies(e)}>
                    <IonInfiniteScrollContent
                        loadingSpinner="bubbles"
                        loadingText="Loading more movies...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </IonContent>
        );
    }
}

export default SelectedMovies;
