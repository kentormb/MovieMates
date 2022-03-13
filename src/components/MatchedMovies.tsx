import React, {useEffect, useState} from "react";
import {IonLoading, useIonViewDidEnter, useIonViewWillEnter} from "@ionic/react";
import '../pages/SelectedMovies.css';
import {getMatchedGroupedMovies, getMatchedMovies, seenThisMovie} from "./Api";
import {getCurrentUser} from "../auth";
import {Card} from "./Card";

interface Prop{
    id: number;
    isGroup: boolean;
}

const SelectedMovies: React.FC<Prop> = ({id, isGroup}) => {

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
    function getMovies(results){
        setIsLoaded(true);
        try {
            let board = document.querySelector('#selected_board_m');
            board.innerHTML = '';
            for (const [index, value] of  Object.entries(results)) {
                const card = Card(+index,value, seenThis);
                board.append(card);
            }
        }
        catch (e) {
            setIsLoaded(false);
        }
    }
    useEffect(() => {

        if(isGroup){
            getMatchedGroupedMovies(getCurrentUser().uid, id ).then((results) => getMovies(results));
        }
        else{
            getMatchedMovies(getCurrentUser().uid, id ).then((results) => getMovies(results));
        }
    },[]);

    if (!isLoaded) {
        return (<IonLoading isOpen/>);
    } else {
        return (
            <div id="selected_board_m" className={"selected_board"}/>
        );
    }
}

export default SelectedMovies;
