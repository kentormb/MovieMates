import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonCheckbox } from '@ionic/react';

import './CategoriesListFilter.css'

import { categories } from '../data/categories';

interface OwnProps {
  onDismissModal: () => void;
}

const CategoriesListFilter: React.FC<OwnProps> = () => {

  const toggleTrackFilter = (track: string) => {
  };

  const onDismissModal = () => void{
  };

  return (
    <>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onDismissModal}>Close</IonButton>
          </IonButtons>
          <IonTitle>
            Categories
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismissModal} strong>Done</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList lines='full'>

          {categories.map((item) =>
              <IonItem key={item.id}>
                <IonLabel>{item.name}</IonLabel>
                <IonCheckbox
                  onClick={() => toggleTrackFilter(item.name)}
                  checked={true}
                  color="primary"
                  value={item.name}
                />
              </IonItem>
          )}

        </IonList>
      </IonContent>

    </>
  );
};

export default CategoriesListFilter;
