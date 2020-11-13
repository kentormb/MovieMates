import {
    IonButtons,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonLabel
} from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';
import './Page.css';
import SelectedMovies from '../components/SelectedMovies';

const MyMovies: React.FC = () => {
  const { status } = useParams();

  return (
    <IonPage>
        <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
            <IonMenuButton />
            </IonButtons>
            <IonTitle>
                {(()=> {
                    if(status === 'liked'){
                        return <IonLabel>Movies I like</IonLabel>
                    }
                    else if(status === 'disliked'){
                        return <IonLabel>Movies I don't like</IonLabel>
                    }
                    else{
                        return <IonLabel>Movies</IonLabel>
                    }
                })()}
            </IonTitle>
        </IonToolbar>
        </IonHeader>

        <SelectedMovies status={status}/>
    </IonPage>
  );
};

export default MyMovies;
