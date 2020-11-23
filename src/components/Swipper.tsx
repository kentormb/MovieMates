import React, {useEffect, useState} from "react";
import * as Hammer from 'hammerjs';
import {IonLoading, IonToast} from "@ionic/react";
import {Card} from "./Card";
import {getFriends, getMovies, updateUsersMovies, suggestMovieToFriend} from "./Api";
import {StateProps} from '../store/reducer';
import {useSelector} from "react-redux"
import {getCurrentUser} from "../auth";

//https://www.hackdoor.io/articles/8MNPqDpV/build-a-full-featured-tinder-like-carousel-in-vanilla-javascript
let topCardId = 0;

class Carousel {
    private board: Element | null;
    private cards: any;
    private topCard: any;
    private hammer: HammerManager | undefined;
    private isPanning: Boolean = false;
    private startPosX: number = 0;
    private startPosY: number = 0;
    private isDraggingFrom: number  | undefined;
    private nextCard: any;
    private page: number;
    private rootDispatcher: any;
    private categories: any;
    private orderBy: any;
    private year: any;
    private adult: any;
    private leftslide: any;
    private rightslide: any;
    private slideWidth: number;

    constructor(element: Element | null, page, rootDispatcher: any = null, categories: any = null, orderBy: any = null, year: any = null, adult: any = null) {

        this.board = element;
        this.page = page;

        this.rootDispatcher = rootDispatcher;

        this.categories = categories;
        this.orderBy = orderBy;
        this.year = year;
        this.adult = adult;

        this.slideWidth = window.innerWidth / 2;

        // handle gestures
        this.handle();
    }

    handle() {

        if(this.board){
            // list all cards
            this.cards = this.board.querySelectorAll(".card");

            this.leftslide = document.getElementById('left-slide')
            this.rightslide = document.getElementById('right-slide')

            // get top card
            this.topCard = this.cards[this.cards.length - 1];

            topCardId = this.topCard.getAttribute('key');
            const li = [...document.getElementsByClassName("suggested")]
            li.map((item)=>item.className = '')

            if (this.cards.length > 0) {
                // listen for pan gesture on top card
                if (this.hammer) this.hammer.destroy();
                this.hammer = new Hammer.default(this.topCard);
                this.hammer.add(
                    new Hammer.Pan({
                        // @ts-ignore
                        position: Hammer.position_ALL,
                        threshold: 0
                    })
                );

                // pass event data to custom callback
                this.hammer.on("pan", (e) => {
                    if (!this.isPanning) {
                        this.isPanning = true

                        // remove transition property
                        this.topCard.style.transition = null

                        // get card coordinates in pixels
                        let style = window.getComputedStyle(this.topCard)
                        let mx = style.transform.match(/^matrix\((.+)\)$/)
                        this.startPosX = mx ? parseFloat(mx[1].split(', ')[4]) : 0
                        this.startPosY = mx ? parseFloat(mx[1].split(', ')[5]) : 0

                        // get card bounds
                        let bounds = this.topCard.getBoundingClientRect()

                        // get finger position on card, top (1) or bottom (-1)
                        this.isDraggingFrom =
                            (e.center.y - bounds.top) > this.topCard.clientHeight / 2 ? -1 : 1

                    }

                    // get new coordinates
                    let posX = e.deltaX + this.startPosX
                    let posY = e.deltaY + this.startPosY

                    // get ratio between swiped pixels and the axes
                    // @ts-ignore
                    let propX = e.deltaX / this.board.clientWidth

                    // get swipe direction, left (-1) or right (1)
                    let dirX = e.deltaX < 0 ? -1 : 1

                    // get degrees of rotation (between 0 and +/- 45)
                    // @ts-ignore
                    let deg = this.isDraggingFrom * dirX * Math.abs(propX) * 45

                    // move and rotate card
                    this.topCard.style.transform ='translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg)'

                    // get scale ratio, between .95 and 1
                    let scale = (95 + (5 * Math.abs(propX))) / 100

                    // move and rotate top card
                    this.topCard.style.transform ='translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg) rotateY(0deg) scale(1)'

                    // scale up next card
                    if (this.nextCard) this.nextCard.style.transform = 'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(' + scale + ')'

                    if(propX > 0 && e.direction === Hammer.DIRECTION_RIGHT){
                        this.leftslide.style.opacity = 0
                        this.rightslide.style.opacity = e.distance / this.slideWidth;
                    }

                    if(propX < 0 && e.direction === Hammer.DIRECTION_LEFT){
                        this.rightslide.style.opacity = 0
                        this.leftslide.style.opacity =  e.distance / this.slideWidth;
                    }

                 if (e.isFinal && this.board) {

                        this.rightslide.style.opacity = 0
                        this.leftslide.style.opacity = 0

                        this.isPanning = false

                        let successful = false

                        // set back transition property
                        this.topCard.style.transition = 'transform 200ms ease-out'

                        // check threshold and movement direction
                        if (propX > 0.25 && e.direction === Hammer.DIRECTION_RIGHT) {

                            // @ts-ignore
                            document.getElementsByClassName('right-slide')[0].style.opacity = 0

                            successful = true
                            // get right border position
                            posX = this.board.clientWidth

                            updateUsersMovies(getCurrentUser().uid, this.topCard.attributes.key.value,1).then((result) => {
                                if(result.error === 0){
                                    this.rootDispatcher.incLiked();
                                }
                            });

                        }
                        else if (propX < -0.25 && e.direction === Hammer.DIRECTION_LEFT) {

                            // @ts-ignore
                            document.getElementsByClassName('left-slide')[0].style.opacity = 0

                            successful = true
                            // get left border position
                            posX = - (this.board.clientWidth + this.topCard.clientWidth)

                            updateUsersMovies(getCurrentUser().uid, this.topCard.attributes.key.value,0).then((result) => {
                                if(result.error === 0){
                                    this.rootDispatcher.incDisLiked();
                                }
                            });

                        }

                        if (successful) {

                            // throw card in the chosen direction
                            this.topCard.style.transform = 'translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg)'

                            // wait transition end
                            setTimeout(() => {
                                // remove swiped card
                                try {
                                    // @ts-ignore
                                    this.board.removeChild(this.topCard)
                                    // add new card
                                    let  cardsleft = this.board.getElementsByClassName('card').length;
                                    if(cardsleft === 15) {
                                        this.push()
                                    }
                                    // handle gestures on new top card
                                    this.handle()

                                }
                                catch (e){
                                    console.log(e.message)
                                }
                            }, 200)

                        } else {
                            // reset card position
                            this.topCard.style.transform = 'translateX(-50%) translateY(-50%) rotate(0deg)'
                        }
                    }
                });

                this.hammer.on("tap", (e) => {
                    this.tap(e);
                });
            }
        }
    }

    push() {
        if(this.board){
            const cat = this.categories.filter((item)=>item.checked).map((item)=>item.id).join();
            getMovies(this.page, getCurrentUser().uid, cat, this.orderBy, this.year, this.adult).then((results) => {
                try {
                    for (const [index, value] of  Object.entries(results)) {
                        const card = Card((+index*this.page),value);
                        this.board.insertBefore(card, this.board.firstChild)
                    }
                    this.page++;
                }
                catch (e) { }
            });
        }
    }

    tap(e:any) {
        // get finger position on top card
        let propX = (e.center.x - e.target.getBoundingClientRect().left) / e.target.clientWidth

        // get rotation degrees around Y axis (+/- 15) based on finger position
        let rotateY = 15 * (propX < 0.05 ? -1 : 1)

        // enable transform transition
        this.topCard.style.transition = 'transform 100ms ease-out'

        // apply rotation around Y axis
        this.topCard.style.transform =
            'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(' + rotateY + 'deg) scale(1)'

        // wait for transition end
        setTimeout(() => {
            // reset transform properties
            this.topCard.style.transform =
                'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(1)'
        }, 100)



    }
}

interface Props{
    rootDispatcher: any;
}

const Swipper: React.FC<Props> = ({rootDispatcher}) => {

    const [isLoaded, setIsLoaded] = useState(false);
    const [friendList, setFriendList] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("You have already suggested this movie");

    const {categories, orderBy, year, adult} = useSelector<StateProps>((state: StateProps) => {
      return state
    });

    const suggestMovie = (el, friendId) =>{
        el.target.closest('li').className = "suggested"
        suggestMovieToFriend(getCurrentUser().uid, topCardId, friendId).then((result)=>{
            if(result.error === 6){
                setToastMessage("You have already suggested this movie")
                setShowToast(true)
            }

        })
    }

    const showSuggestedFriends = () =>{
        if(friendList.length === 0){
            getFriends(getCurrentUser().uid,1).then((results)=>{
                if(results.error === 0 && results.result.length > 0){
                    setFriendList(results.result)
                    rootDispatcher.updateFriends(results.result)
                }
                else{
                    setToastMessage("You have no friends yet")
                    setShowToast(true)
                }
            })
        }
        document.getElementById('suggest-container').classList.toggle('open')
    }



    useEffect(() => {
        if(categories.length > 0){
            setIsLoaded(false);
            const cat = categories.filter((item)=>item.checked).map((item)=>item.id).join();
            getMovies(1, getCurrentUser().uid, cat, orderBy, year, adult).then((results) => {
                setIsLoaded(true);
                try {
                    let board = document.querySelector('#board');
                    for (const [index, value] of  Object.entries(results)) {
                        board.append(Card(+index,value));
                    }
                    new Carousel(board,2, rootDispatcher, categories, orderBy, year, adult);
                }
                catch (e) {
                    setIsLoaded(false);
                }

            });
        }
    }, [categories,orderBy,year]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!isLoaded) {
        return (<IonLoading isOpen/>);
    } else {
        return (
            <>
                <span id="left-slide" className={"left-slide"} />
                <div id="board"/>
                <div className={"suggest-container"} id={"suggest-container"}>
                    <span className={"suggest-btn plus"} onClick={showSuggestedFriends}/>
                    <div className={"suggest-friends-list"} id={"suggest-friends-list"}>
                        <span className={"title"}>Suggest this movie to a friend</span>
                        <ul>
                        {friendList.map((item) =>
                            <li key={item.id} onClick={(el) => suggestMovie(el, item.id)}>
                                <img src={item.icon} alt=''/>
                                <span>{item.name!=='' ? item.name : item.username}</span>
                            </li>
                        )}
                        </ul>
                    </div>
                </div>
                <span id="right-slide" className={"right-slide"} />
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={2500}
                    color={'warning'}
                />
            </>
        );
    }
}

export default Swipper;
