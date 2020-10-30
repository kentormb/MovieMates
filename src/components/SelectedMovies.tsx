import React, {useEffect, useState} from "react";
import {IonContent, IonLoading, IonRefresher, IonRefresherContent} from "@ionic/react";
import {Card} from "./Card";
import {getUsersMovies, updateUsersMovies} from "./Api";
import {getCurrentUser} from "../auth";
import '../pages/SelectedMovies.css';
import {RefresherEventDetail} from "@ionic/core";

interface Prop{
    status: string | number;
}

const SelectedMovies: React.FC<Prop> = ({status}) => {

    const [isLoaded, setIsLoaded] = useState(false);

    async function getMovies(){
        getUsersMovies(1, getCurrentUser().uid, status === 'liked' ? 1 : 0 ).then((results) => {
            setIsLoaded(true);
            try {
                let board = document.querySelector('#selected_board');
                board.innerHTML = '';
                for (const [index, value] of  Object.entries(results)) {
                    const card = Card(+index,value);

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

    //TODO
    const board = document.querySelector('#selected_board');
    if(board){
        board.innerHTML = 'Loading movies...'
    }

    useEffect(() => {
        getMovies()
    }, [status]);

    if (!isLoaded) {
        return (<IonLoading isOpen/>);
    } else {
        return (
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent/>
                </IonRefresher>
                <div id="selected_board"/>
            </IonContent>
        );
    }
}

export default SelectedMovies;
