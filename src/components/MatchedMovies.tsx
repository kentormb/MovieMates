import React, {useEffect, useState} from "react";
import {IonLoading} from "@ionic/react";
import '../pages/SelectedMovies.css';
import {getMatchedMovies} from "./Api";
import {getCurrentUser} from "../auth";
import {Card} from "./Card";

interface Prop{
    id: number;
}

const SelectedMovies: React.FC<Prop> = ({id}) => {

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        getMatchedMovies(getCurrentUser().uid, id ).then((results) => {
            setIsLoaded(true);
            try {
                let board = document.querySelector('#selected_board');
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
    }, [id]);

    if (!isLoaded) {
        return (<IonLoading isOpen/>);
    } else {
        return (
            <div id="selected_board"/>
        );
    }
}

export default SelectedMovies;
