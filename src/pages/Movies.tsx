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
import {showAdultContent} from "../configs"
import {getCurrentUser} from "../auth";
import {getAllProviders} from "../components/Api";

const Movies: React.FC = () => {

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [adult, setAdult] = useState(0);
    const [years, setYears] = useState(10);
    const [orderBy,setOrderBy] = useState(1);
    const [providerPage, setProviderPage] = useState(1);
    const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);
    const [categories, setCategories] = useState(cats);
    const [providers, setProviders] = useState([]);
    const [selectedProviders, setSelectedProviders] = useState([]);
    const pageRef = useRef<HTMLElement>(null);
    const { Storage } = Plugins;
    let scroll = true;

    const dispatch = useDispatch();
    const rootDispatcher = new RootDispatcher(dispatch);

    const closeModal = () => setShowFilterModal(false);

    const pushData = () => {
        getAllProviders(getCurrentUser().uid, providerPage).then((res)=>{
            if(res['error'] === 0){
                let p = providers;
                p.push(...res['results']);
                setProviders(p);
                setProviderPage(providerPage + 1);
                if(res['total_count'][0]['total_count'] === providers.length){
                    setIsInfiniteDisabled(true);
                }
            }
        });
    }

    async function loadMoreProviders(e){
        const threshold = 50;
        if(e.currentTarget.scrollTop + e.currentTarget.offsetHeight + threshold > e.currentTarget.scrollHeight && scroll && !isInfiniteDisabled){
            scroll = false;
            pushData();
        }

    }

    const selectProvider = (ev, id) => {
        let sp = selectedProviders.includes(id) ? selectedProviders.filter( (val) => val !== id ) : [...selectedProviders, id];
        ev.currentTarget.classList.toggle("selected");
        setSelectedProviders(sp);
    }

    const setAdultHandler = (value) => {
        setAdult(value ? 1 : 0);
    }

    const saveOptions = () => {
        rootDispatcher.updateCategories(categories.filter((item)=>item.checked))
        rootDispatcher.updateOrderBy(orderBy)
        rootDispatcher.updateYears(years)
        rootDispatcher.updateAdults(adult)
        rootDispatcher.updateSelectedProviders(selectedProviders)
        Storage.set({
            key: 'categories',
            value: JSON.stringify(categories)
        });
        Storage.set({
            key: 'filters',
            value: JSON.stringify({adult: adult, years: years, orderby: orderBy})
        });
        Storage.set({
            key: 'selected_providers',
            value: JSON.stringify(selectedProviders)
        });
        setShowFilterModal(false);
    }

    const setChecked = (id: number | string, checked: boolean) => {
        let cat = categories
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

        Storage.get({ key: 'selected_providers' }).then((result)=>{
            if(result.value){
                setSelectedProviders( JSON.parse(result.value))
                rootDispatcher.updateSelectedProviders(JSON.parse(result.value))
            }
        });

        pushData();

        // Storage.get({ key: 'filters' }).then((result)=>{
        //     if(result.value){
        //         const v = JSON.parse(result.value)
        //         setAdult( v.adult)
        //         rootDispatcher.updateAdults(v.adult)
        //         setYears( v.years)
        //         rootDispatcher.updateYears(v.years)
        //         setOrderBy( v.orderby)
        //         rootDispatcher.updateOrderBy(v.orderby)
        //     }
        // });
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
                            <IonButton color="success" onClick={saveOptions} strong>Save</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Providers</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent className={"providers-filter"} onScroll={(e) => loadMoreProviders(e)}>
                            {providers.map((item) =>
                                <img onClick={(e)=>{selectProvider(e, item.provider_id)}}
                                     key={item.provider_id} src={'https://image.tmdb.org/t/p/original' + item.logo_path}
                                     className={selectedProviders.includes(item.provider_id) ? 'selected' : ''}
                                     alt={item.provider_name} />
                            )}
                            { !isInfiniteDisabled ? <span className={"providers-load-more"}>Loading more...</span> : ''}
                        </IonCardContent>
                    </IonCard>
                    {
                        showAdultContent() ? (
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
                            </IonCard> )
                            : ''
                    }
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Check {years} year{years === 1 ? '' : 's'} back</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonRange min={1} max={220} pin={true} value={years} onIonChange={e => setYears(+e.detail.value)} />
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
