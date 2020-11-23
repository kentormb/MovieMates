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
    IonModal,
    IonLabel,
    IonList,
    IonItem,
    IonToggle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent, IonRadioGroup, IonRadio, IonRange
} from '@ionic/react';
import React, {useState, useRef, useEffect} from 'react';
import './Page.css';
import { options } from "ionicons/icons";
import Swipper from "../components/Swipper";
import {useDispatch} from "react-redux";
import {RootDispatcher} from "../store/reducer";
import {cats} from "../data/categories";
import { Plugins } from '@capacitor/core';

const Movies: React.FC = () => {

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [adult, setAdult] = useState(0);
    const [year, setYear] = useState(10);
    const [orderBy,setOrderBy] = useState(1);
    const [categories, setCategories] = useState(cats);
    const pageRef = useRef<HTMLElement>(null);
    const { Storage } = Plugins;

    const dispatch = useDispatch();
    const rootDispatcher = new RootDispatcher(dispatch);

    const closeModal = () => setShowFilterModal(false);

    const setAdultHandler = (value) =>{

        if(value){
            setAdult(1)
        }
        else{
            setAdult(0)
        }

    }

    const saveOptions = () => {
        rootDispatcher.updateCategories(categories.filter((item)=>item.checked))
        rootDispatcher.updateOrderBy(orderBy)
        rootDispatcher.updateYears(year)
        rootDispatcher.updateAdults(adult)
        console.log('save',adult)
        Storage.set({
            key: 'categories',
            value: JSON.stringify(categories)
        });
        setShowFilterModal(false);
    }

    const setChecked = (id: number | string, checked: boolean) => {
        let cat = categories;
        cat[categories.findIndex(x => x.id === id)].checked = checked
        setCategories(cat)
    };

    useEffect(()=>{
        Storage.get({ key: 'categories' }).then((result)=>{
            if(result.value){
                setCategories( JSON.parse(result.value))
                rootDispatcher.updateCategories(JSON.parse(result.value).filter((item)=>item.checked))
            }
            else{
                rootDispatcher.updateCategories(categories.filter((item)=>item.checked))
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
                <IonTitle><IonLabel>Movies</IonLabel></IonTitle>
                <IonButtons slot="end">
                    <IonButton onClick={() => setShowFilterModal(true)}>
                        <IonIcon icon={options} slot="icon-only" />
                    </IonButton>
                </IonButtons>
            </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <Swipper rootDispatcher={rootDispatcher}/>
            </IonContent>
            <IonModal
                isOpen={showFilterModal}
                onDidDismiss={() => setShowFilterModal(false)}
                swipeToClose={true}
                presentingElement={pageRef.current!}
                cssClass="session-list-filter"
            >
                <IonHeader translucent={true}>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={closeModal}>Close</IonButton>
                        </IonButtons>
                        <IonTitle>
                            Filters
                        </IonTitle>
                        <IonButtons slot="end">
                            <IonButton color="success" onClick={saveOptions} strong>Done</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Adult content</IonCardTitle>
                            <IonToggle
                                className={"floating-toggle"}
                                checked={!!adult}
                                onIonChange={e => {setAdultHandler(e.detail.checked)}}
                                color="primary"
                            />
                        </IonCardHeader>
                    </IonCard>
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Check {year} year{year === 1 ? '' : 's'} back</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonRange min={1} max={220} pin={true} value={year} onIonChange={e => setYear(+e.detail.value)} />
                        </IonCardContent>
                    </IonCard>
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>
                                <IonCardTitle>Order by</IonCardTitle>
                                <IonCardContent>
                                    <IonList lines='full'>
                                        <IonRadioGroup value={orderBy} onIonChange={e => {setOrderBy(e.detail.value)}}>
                                            <IonItem key={1}>
                                                <IonLabel>Popularity</IonLabel>
                                                <IonRadio slot="end" value={1} />
                                            </IonItem>
                                            <IonItem key={2}>
                                                <IonLabel>Release Date</IonLabel>
                                                <IonRadio slot="end" value={2} />
                                            </IonItem>
                                            <IonItem key={3}>
                                                <IonLabel>Vote Count</IonLabel>
                                                <IonRadio slot="end" value={3} />
                                            </IonItem>
                                        </IonRadioGroup>
                                    </IonList>
                                </IonCardContent>
                            </IonCardTitle>
                        </IonCardHeader>
                    </IonCard>
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Genre</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonList lines='full'>
                                {categories.map((item) =>
                                    <IonItem key={item.id}>
                                        <img className={"mm-cat-img"} src={'/assets/icon/' + item.icon + '.png'} alt={item.name} />
                                        <IonLabel className={"mm-bold"}>{item.name}</IonLabel>
                                        <IonToggle
                                            checked={item.checked}
                                            onIonChange={e => setChecked(item.id, e.detail.checked)}
                                            color="primary"
                                        />
                                    </IonItem>
                                )}
                            </IonList>
                        </IonCardContent>
                    </IonCard>
                </IonContent>
            </IonModal>
        </IonPage>
    );
};

export default Movies;
