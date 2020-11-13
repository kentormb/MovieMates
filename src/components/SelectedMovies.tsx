import React, { useState } from "react";
import {IonContent, IonLoading, IonRefresher, IonRefresherContent, useIonViewWillEnter} from "@ionic/react";
import {Card} from "./Card";
import {getUsersMovies, seenThisMovie, updateUsersMovies} from "./Api";
import {getCurrentUser} from "../auth";
import '../pages/SelectedMovies.css';
import {RefresherEventDetail} from "@ionic/core";

interface Prop{
    status: string | number;
}

const SelectedMovies: React.FC<Prop> = ({status}) => {

    const [isLoaded, setIsLoaded] = useState(false);

    function seenThis(mid,status){
        seenThisMovie(getCurrentUser().uid, mid, status).then(()=>{
            if(status === 1){
                const c = document.querySelector('[key="'+mid+'"]');
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

    async function getMovies(){
        getUsersMovies(1, getCurrentUser().uid, status === 'liked' ? 1 : 0 ).then((results) => {
            setIsLoaded(true);
            try {
                let board = document.querySelector('#selected_board');
                board.innerHTML = '';
                for (const [index, value] of  Object.entries(results)) {

                    // @ts-ignore
                    const card = Card(+index,value,seenThis);
                    card.className = 'card dis-likes';

                    const action = document.createElement('div');
                    action.setAttribute('class','action');

                    const button = document.createElement('div');

                    if(status === 'liked'){
                        button.innerText = 'I don\'t like this';
                        button.setAttribute('class','button liked');
                        button.addEventListener('click', ()=>{
                            // @ts-ignore
                            updateUsersMovies(getCurrentUser().uid, value.movieId,0);
                            card.remove();
                        })
                    }
                    else{
                        button.innerText = 'I like this';
                        button.setAttribute('class','button disliked');
                        button.addEventListener('click', ()=>{
                            // @ts-ignore
                            updateUsersMovies(getCurrentUser().uid, value.movieId,1);
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
        getMovies().then(()=>{
            event.detail.complete()
        })
    }

    useIonViewWillEnter(() => {
        getMovies().then();
    });

    if (!isLoaded) {
        return (<IonLoading isOpen/>);
    } else {
        return (
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent/>
                </IonRefresher>
                <div id="selected_board" className={"selected_board"}/>
            </IonContent>
        );
    }
}

export default SelectedMovies;
