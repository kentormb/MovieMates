import React, {useEffect, useState} from "react";
import * as Hammer from 'hammerjs';
import {IonLoading} from "@ionic/react";
import {Card} from "./Card";
import {getMovies, updateUsersMovies} from "./Api";
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

    constructor(element: Element | null, page) {

        this.board = element;
        this.page = page;

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

                    if (e.isFinal && this.board) {

                        this.isPanning = false

                        let successful = false

                        // set back transition property
                        this.topCard.style.transition = 'transform 200ms ease-out'

                        // check threshold and movement direction
                        if (propX > 0.25 && e.direction === Hammer.DIRECTION_RIGHT) {

                            successful = true
                            // get right border position
                            posX = this.board.clientWidth

                            updateUsersMovies(getCurrentUser().uid, this.topCard.attributes.key.value,1);

                        }
                        else if (propX < -0.25 && e.direction === Hammer.DIRECTION_LEFT) {

                            successful = true
                            // get left border position
                            posX = - (this.board.clientWidth + this.topCard.clientWidth)

                            updateUsersMovies(getCurrentUser().uid, this.topCard.attributes.key.value,0);

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
                    const mi = this.topCard.getElementsByClassName('moreinfo')[0];
                    if (mi.style.display === "none") {
                        mi.style.display = "block";
                    } else {
                        mi.style.display = "none";
                    }

                });
            }
        }
    }

    push() {
        if(this.board){
            console.log('reload started');
            console.time("reload start");
            getMovies(this.page, getCurrentUser().uid).then((results) => {
                try {
                    for (const [index, value] of  Object.entries(results)) {
                        const card = Card((+index*this.page),value);
                        this.board.insertBefore(card, this.board.firstChild)
                    }
                    console.log('reload completed');
                    this.page++;
                    //this.handle()
                    console.timeEnd("reload start");
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

const Swipper: React.FC = () => {

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        getMovies(1, getCurrentUser().uid ).then((results) => {
            setIsLoaded(true);
            try {
                let board = document.querySelector('#board');
                for (const [index, value] of  Object.entries(results)) {
                    board.append(Card(+index,value));
                }
                new Carousel(board,2);
            }
            catch (e) {
                setIsLoaded(false);
            }

        });
    }, []);

    if (!isLoaded) {
        return (<IonLoading isOpen/>);
    } else {
        return (
            <div id="board"></div>
        );
    }
}

export default Swipper;
