import React from "react";
import * as Hammer from 'hammerjs';

class Carousel {
    private board: Element | null;
    private cards: any;
    private topCard: any;
    private hammer: HammerManager | undefined;
    private isPanning: Boolean = false;
    private startPosX: number | undefined;
    private startPosY: number | undefined;
    private isDraggingFrom: number  | undefined;

    constructor(element: Element | null) {

        this.board = element;

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
                    // @ts-ignore
                    let posX = e.deltaX + this.startPosX
                    // @ts-ignore
                    let posY = e.deltaY + this.startPosY

                    // get ratio between swiped pixels and the axes
                    // @ts-ignore
                    let propX = e.deltaX / this.board.clientWidth
                    // @ts-ignore
                    let propY = e.deltaY / this.board.clientHeight

                    // get swipe direction, left (-1) or right (1)
                    let dirX = e.deltaX < 0 ? -1 : 1

                    // get degrees of rotation (between 0 and +/- 45)
                    // @ts-ignore
                    let deg = this.isDraggingFrom * dirX * Math.abs(propX) * 45

                    // move and rotate card
                    this.topCard.style.transform =
                        'translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg)'

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

                        } else if (propX < -0.25 && e.direction === Hammer.DIRECTION_LEFT) {

                            successful = true
                            // get left border position
                            posX = - (this.board.clientWidth + this.topCard.clientWidth)

                        } else if (propY < -0.25 && e.direction === Hammer.DIRECTION_UP) {

                            successful = true
                            // get top border position
                            posY = - (this.board.clientHeight + this.topCard.clientHeight)

                        }

                        if (successful) {

                            // throw card in the chosen direction
                            this.topCard.style.transform =
                                'translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg)'

                            // wait transition end
                            setTimeout(() => {
                                // remove swiped card
                                // @ts-ignore
                                this.board.removeChild(this.topCard)
                                // add new card
                                this.push()
                                // handle gestures on new top card
                                this.handle()
                            }, 200)

                        } else {

                            // reset card position
                            this.topCard.style.transform =
                                'translateX(-50%) translateY(-50%) rotate(0deg)'

                        }

                    }
                });
            }
        }
    }

    push() {

        let card = document.createElement('div')
        card.classList.add('card')

        card.style.backgroundColor = "#" + (Math.floor(Math.random()*16777215).toString(16))

        // @ts-ignore
        this.board.insertBefore(card, this.board.firstChild)

    }
}

const Swipper: React.FC = () => {

    let board = document.querySelector('#board')
    new Carousel(board)

    return (
        <div id="board">
            <div className="c1 card"/>
            <div className="c2 card"/>
            <div className="c3 card"/>
            <div className="c4 card"/>
            <div className="c5 card"/>
        </div>
    );

}

export default Swipper;
