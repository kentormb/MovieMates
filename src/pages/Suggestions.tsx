import {IonButtons, IonCard, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import React, {useEffect} from 'react';
import './Page.css'
import {RootDispatcher} from "../store/reducer";
import {useDispatch} from "react-redux";
import {getSuggestedMovies, updateUsersMovies} from "../components/Api";
import {getCurrentUser} from "../auth";
import {Card} from "../components/Card";
import { useHistory } from "react-router-dom";

const Suggestions: React.FC = () => {

    const dispatch = useDispatch();
    const rootDispatcher = new RootDispatcher(dispatch);
    const history = useHistory();

    useEffect(() => {
        getSuggestedMovies(getCurrentUser().uid).then((results) => {

            let board = document.querySelector('#suggested_board');
            //board.innerHTML = '';
            for (const [index, value] of  Object.entries(results)) {

                // @ts-ignore
                const card = Card(+index,value);
                const img = document.createElement('img');
                // @ts-ignore
                img.setAttribute('src', value.icon);
                img.className = 'suggested-friend-icon'
                img.addEventListener('click', (e)=>{
                    e.preventDefault();
                    // @ts-ignore
                    history.push('/my/friend/'+value.uid);
                })

                const action = document.createElement('div');
                action.setAttribute('class','action');

                const button = document.createElement('div');

                button.innerText = 'Remove';
                button.setAttribute('class','button liked');
                button.addEventListener('click', ()=>{
                    card.remove();
                })

                const likeButton = document.createElement('div');
                likeButton.innerText = 'I like this';
                likeButton.setAttribute('class','button disliked');
                likeButton.addEventListener('click', ()=>{
                    // @ts-ignore
                    updateUsersMovies(getCurrentUser().uid, value.movieId,1).then((result)=>{
                        card.remove();
                    });
                })

                action.append(button)
                action.append(likeButton)
                card.append(img)
                card.append(action)
                board.append(card);
            }

        });
    },[]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Suggestions</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <div id="suggested_board" className={"selected_board"}/>
      </IonContent>
    </IonPage>
    );
};

export default Suggestions;
