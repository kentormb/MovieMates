import {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonModal, IonLabel
} from '@ionic/react';
import React, {useState, useRef} from 'react';
import './Page.css';
import { options } from "ionicons/icons";
import CategoriesListFilter from "../components/CategoriesListFilter";
import Swipper from "../components/Swipper";

const Movies: React.FC = () => {

    const [showFilterModal, setShowFilterModal] = useState(false);
    const pageRef = useRef<HTMLElement>(null);

    return (
    <IonPage>
        <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
            <IonMenuButton />
            </IonButtons>
            <IonTitle><IonLabel>Movies</IonLabel></IonTitle>
            <IonButtons slot="end">
                <IonButton onClick={() => setShowFilterModal(true)}>
                    <IonIcon icon={options} slot="icon-only" />
                </IonButton>
            </IonButtons>
        </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <Swipper/>
        </IonContent>
        <IonModal
            isOpen={showFilterModal}
            onDidDismiss={() => setShowFilterModal(false)}
            swipeToClose={true}
            presentingElement={pageRef.current!}
            cssClass="session-list-filter"
        >
            <CategoriesListFilter
                onDismissModal={() => setShowFilterModal(false)}
            />
        </IonModal>
    </IonPage>
    );
};

export default Movies;
