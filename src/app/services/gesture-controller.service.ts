import { Injectable, NgZone } from '@angular/core';
import { GestureController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ObserveOnOperator } from 'rxjs/internal/operators/observeOn';

@Injectable({
  providedIn: 'root'
})
export class GestureControllerService {

  // public swipeToMatch = false;

  // getSwipeStatus() {
  //   return new Observable(observer => {
  //     observer.next(this.swipeToMatch);
  //   });
  // }

  constructor(
    private gestureCtrl: GestureController,
    private zone: NgZone,
    private platform: Platform,
  ) {}


  useSwiperGesture(cardArray) {
    for (const card of cardArray) {
      //const card = eachCard;
      // console.log("card", card);

      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        threshold: 15,
        gestureName: 'swipte',
        onStart: (ev) => {},
        onMove: (ev) => {
          // console.log("ev : ", ev);
          card.nativeElement.style.transform = `translateX(${
            ev.deltaX
          }px) rotate(${ev.deltaX / 10}deg)`;

          //TO SET COLOR ON SWIPE
          this.setCardColor(ev.deltaX, card.nativeElement);
        },
        onEnd: (ev) => {
          card.nativeElement.style.transition = '.5s ease-out';

          //Right side Move
          if (ev.deltaX > 150) {
            card.nativeElement.style.transform = `translateX(${
              +this.platform.width() * 2
            }px) rotate(${ev.deltaX / 2}deg)`;
            console.log('Matched');
            //this.swipeToMatch = true;
          }
          // Left Side Move
          else if (ev.deltaX < -150) {
            card.nativeElement.style.transform = `translateX(-${
              + this.platform.width() * 2
            }px) rotate(${ev.deltaX / 2}deg)`;
            console.log('Unmatched');
            //this.swipeToMatch = false;
          }
          // When No move or if small move back to original
          else {
            card.nativeElement.style.transform = '';
          }
        },
      });
      gesture.enable(true);
    }
  }

  // STYLE OF CARD WHEN GESTURE START
  setCardColor(x, element) {
    let color = '';
    const abs = Math.abs(x);
    const min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
    const hexCode = this.decimalToHex(min, 2);

    if (x < 0) {
      color = '#FF' + hexCode + 'FF' + hexCode;
    } else {
      color = '#' + hexCode + 'FF' + hexCode;
    }
    element.style.background = color;
  }

  decimalToHex(d, padding) {
    let hex = Number(d).toString(16);
    padding =
      typeof padding === 'undefined' || padding === null
        ? (padding = 2)
        : padding;

    while (hex.length < padding) {
      hex = '0' + hex;
    }
    return hex;
  }

}
