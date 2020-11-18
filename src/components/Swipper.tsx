import React, {useEffect, useState} from "react";
import * as Hammer from 'hammerjs';
import {IonLoading} from "@ionic/react";
import {Card} from "./Card";
import {getMovies, updateUsersMovies} from "./Api";
import {StateProps} from '../store/reducer';
import { useSelector } from "react-redux"
import {getCurrentUser} from "../auth";
//https://www.hackdoor.io/articles/8MNPqDpV/build-a-full-featured-tinder-like-carousel-in-vanilla-javascript

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

    constructor(element: Element | null, page, rootDispatcher: any = null, categories: any = null, orderBy: any = null, year: any = null) {

        this.board = element;
        this.page = page;

        this.rootDispatcher = rootDispatcher;

        this.categories = categories;
        this.orderBy = orderBy;
        this.year = year;

        // handle gestures
        this.handle();
    }

    handle() {

        if(this.board){
            // list all cards
            this.cards = this.board.querySelectorAll(".card");

            // get top card
            this.topCard = this.cards[this.cards.length - 1];

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

                        // @ts-ignore
                        document.getElementsByClassName('left-slide')[0].style.opacity = 0
                        const rs = document.getElementsByClassName('right-slide')
                        let opacity  = (e.distance / (window.innerWidth/2));
                        // @ts-ignore
                        rs[0].style.opacity = opacity;
                    }

                    if(propX < 0 && e.direction === Hammer.DIRECTION_LEFT){

                        // @ts-ignore
                        document.getElementsByClassName('right-slide')[0].style.opacity = 0
                        const ls = document.getElementsByClassName('left-slide')
                        let opacity  = (e.distance / (window.innerWidth/2));
                        // @ts-ignore
                        ls[0].style.opacity = opacity;
                    }


                 if (e.isFinal && this.board) {

                        // @ts-ignore
                        document.getElementsByClassName('right-slide')[0].style.opacity = 0
                        // @ts-ignore
                        document.getElementsByClassName('left-slide')[0].style.opacity = 0

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
                            console.log('success')
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
            getMovies(this.page, getCurrentUser().uid, cat, this.orderBy, this.year).then((results) => {
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

    const categories = useSelector<StateProps>((state: StateProps) => {
      return state.categories
    });

    const orderBy = useSelector<StateProps>((state: StateProps) => {
        return state.orderBy
    });

    const year = useSelector<StateProps>((state: StateProps) => {
        return state.years
    });

    useEffect(() => {
        if(categories.length > 0){
            setIsLoaded(false);
            const cat = categories.filter((item)=>item.checked).map((item)=>item.id).join();
            getMovies(1, getCurrentUser().uid, cat, orderBy,year).then((results) => {
                setIsLoaded(true);
                try {
                    let board = document.querySelector('#board');
                    for (const [index, value] of  Object.entries(results)) {
                        board.append(Card(+index,value));
                    }
                    new Carousel(board,2, rootDispatcher, categories, orderBy, year);
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
            <span className={"left-slide"} />
            <div id="board"/>
            <span className={"right-slide"} />
            </>
        );
    }
}

export default Swipper;
