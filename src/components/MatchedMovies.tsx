import React, {useEffect, useState} from "react";
import {IonLoading, useIonViewDidEnter, useIonViewWillEnter} from "@ionic/react";
import '../pages/SelectedMovies.css';
import {getMatchedMovies} from "./Api";
import {getCurrentUser} from "../auth";
import {Card} from "./Card";

interface Prop{
    id: number;
}

const SelectedMovies: React.FC<Prop> = ({id}) => {

    const [isLoaded, setIsLoaded] = useState(false);
    const [cards, setCards] = useState([])

    useIonViewDidEnter(() => {
        getMatchedMovies(getCurrentUser().uid, id ).then((results) => {
            setIsLoaded(true);
            try {
                let board = document.querySelector('#selected_board_m');
                board.innerHTML = '';
                for (const [index, value] of  Object.entries(results)) {
                    const card = Card(+index,value);
                    board.append(card);
                }
            }
            catch (e) {
                setIsLoaded(false);
            }

        });
    });

    if (!isLoaded) {
        return (<IonLoading isOpen/>);
    } else {
        return (
            <div id="selected_board_m" className={"selected_board"}/>
        );
    }
}

export default SelectedMovies;
