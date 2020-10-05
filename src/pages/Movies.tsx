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
    IonModal
} from '@ionic/react';
import React, {useState, useRef} from 'react';
import { useParams } from 'react-router';
import './Page.css';
import {options} from "ionicons/icons";
import CategoriesListFilter from "../components/CategoriesListFilter";
import Swipper from "../components/Swipper";

const Movies: React.FC = () => {

  const { name } = useParams<{ name: string; }>();
  //const [showSearchbar, setShowSearchbar] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const pageRef = useRef<HTMLElement>(null);

  //const mode = 'md';

  return (
    <IonPage>

        <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Movies</IonTitle>
            <IonButtons slot="end">
                <IonButton onClick={() => setShowFilterModal(true)}>
                    <IonIcon icon={options} slot="icon-only" />
                </IonButton>
            </IonButtons>
        </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name} aaa</IonTitle>
          </IonToolbar>
        </IonHeader>
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
