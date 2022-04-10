import { Component, OnInit, ElementRef, QueryList, ViewChildren, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { RecommendationEngine } from './RecommendationEngine';
import { FindBuddyQuery } from './FindBuddyQuery';
import { DbRetrieveService } from './../../../services/db-retrieve.service';
import { GymBuddyProfileInfo } from './GymBuddyInformation';
import { threadId } from 'worker_threads';
import { GestureController, LoadingController, Platform } from '@ionic/angular';
import { GymBuddyService } from 'src/app/services/gym-buddy.service';
import { GestureControllerService } from 'src/app/services/gesture-controller.service';
import { IonCard } from '@ionic/angular';

export interface CardData {
  imageId: string;
  state: 'default' | 'flipped' | 'matched';
}

@Component({
  selector: 'app-gb-findbuddy',
  templateUrl: './gb-findbuddy.page.html',
  styleUrls: ['./gb-findbuddy.page.scss'],
})
export class GbFindbuddyPage implements OnInit, AfterViewInit {

  /**
   * For Ionic Gestures.
   */
  @ViewChildren(IonCard, { read: ElementRef }) cards: QueryList<ElementRef>;



  people = [
    {
      id: '0',
      name: 'Bryan',
      briefIntro: 'Loves a hustle',
      goals: ['Gain muscle mass', 'Lose Weight'],
      strengths: ['Powerlifting', 'Aerobic'],
      style: ['high intensity', 'weights'],
      location: ['outdoor', 'gym'],
      time: ['Morning', 'Night'],
      age: 23,
      img:
        'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      //power: 0,
    },
    {
      id: '1',
      name: 'Gladys',
      briefIntro: 'Transient and temporary',
      goals: ['Increase Stamina', 'Lift heavier'],
      strengths: ['Ploymetric', 'Pilates'],
      style: ['Flexibility', 'Yoga'],
      location: ['Studio', 'Park'],
      time: ['Afternoon', 'Evening'],
      age: 23,
      img:
        'https://images.pexels.com/photos/33045/lion-wild-africa-african.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      //power: 0,
    },
    {
      id: '2',
      name: 'Zhi Kai',
      briefIntro: 'Fearless and adventurous',
      goals: ['Gain muscle mass', 'Lose Weight'],
      strengths: ['Powerlifting', 'Aerobic'],
      style: ['high intensity', 'weights'],
      location: ['outdoor', 'gym'],
      time: ['Morning', 'Night'],
      age: 23,
      img:
        'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      //power: 0,
    },
  ];
  potentialMatches: (GymBuddyProfileInfo)[] = [];


  private recommendationEngine;
  private currentUser: GymBuddyProfileInfo;
  private recommendedUser: GymBuddyProfileInfo;
  private findBuddyQuery: FindBuddyQuery;



  constructor(
    private loadingController: LoadingController,
    private router: Router,
    private dbRetrieve: DbRetrieveService,
    //private gestureControlService: GestureControllerService
    private gestureCtrl: GestureController,
    private zone: NgZone,
    private platform: Platform,
    private gbService: GymBuddyService
  ) { }

  public get getFullName() {
    if(this.recommendedUser) {
      return this.recommendedUser.name;
    }
    return 'Full Name';
  }

  public get getAge() {
    if(this.recommendedUser) {
      return this.recommendedUser.age;
    }
    return 'Age';
  }

  public get getBriefIntro() {
    if(this.recommendedUser) {
      return this.recommendedUser.getbriefIntro;
    }
    return 'Brief Introduction';
  }

  public get getProfilePicture() {
    if(this.recommendedUser) {
      return this.recommendedUser.profilePicture;
    }
    return 'Profile Picture';
  }

  public get getMoreGymBuddyInformation() {
    return 'More Information';
  }

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
            this.matchBuddy();
          }
          // Left Side Move
          else if (ev.deltaX < -150) {
            card.nativeElement.style.transform = `translateX(-${
              + this.platform.width() * 2
            }px) rotate(${ev.deltaX / 2}deg)`;
            console.log('Unmatched');
            //this.swipeToMatch = false;
            this.unmatchBuddy();
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

  public getColor(i: number) {
    i = i % 5;
    const colors = ['#ED93D5','#94DAEC','#FB6175','#EFBCFF','#F2D28A'];
    return colors[i];
  }

  ngOnInit() {
    this.potentialMatches = this.gbService.getPotentialMatchDetails();
    console.log('Say hi to these people: ', this.potentialMatches);
    this.currentUser = this.dbRetrieve.retrieveCurrentUser();
    //this.recommendationEngine = new RecommendationEngine(this.currentUser);
    this.findBuddyQuery= new FindBuddyQuery(this.dbRetrieve,this.currentUser);
    // this.recommendationEngine.getAllMatches(await this.findBuddyQuery.findBuddyQuery());
    // // First user to be displayed
    // while (true) {
    //   const potentialMatch: GymBuddyProfileInfo = this.recommendationEngine.pollMatch();
    //   console.log(potentialMatch);
    //   if (potentialMatch != null) {
    //     console.log(potentialMatch);
    //     //means potential match is not null (still have matches)
    //     this.potentialMatches.push(potentialMatch);
    //   } else {
    //     console.log('instant chao');
    //     break;
    //   }
    // }
    //console.log(this.potentialMatches[0]);
    //this.recommendedUser = this.potentialMatches
    // this.recommendedUser=this.recommendationEngine.pollMatch();
    // console.log(this.recommendedUser);
  }

  ngAfterViewInit() {
    const cardArray = this.cards.toArray();
    this.useSwiperGesture(cardArray);
    // this.gestureControlService.getSwipeStatus().subscribe((val) => {
    //   console.log(val);
    //   if (val === true) {
    //     this.matchBuddy();
    //   } else {
    //     this.unmatchBuddy();
    //   }
    // });
  }


  public getCurrentUser(): GymBuddyProfileInfo {
    return this.currentUser;
  }




  public async goToGBHome() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
  }

  // public async matchBuddy() {
  //   this.findBuddyQuery.addMatches(this.recommendedUser.getUserId);
  //   if(this.recommendedUser.checkMatches(this.currentUser.getUserId)){
  //         this.createChat(this.currentUser.getUserId, this.recommendedUser.getUserId);
  //   }
  //   this.recommendedUser=this.recommendationEngine.pollMatch();
  //   if(!this.recommendedUser){
  //     this.displayNoMoreMatches();
  //   }
  //   else {
  //     console.log('Match Buddy');
  //   }
  // }

  public async matchBuddy() {
    //ion cards are displayed from the last element of array to first.
    const matchedPerson = this.potentialMatches.pop();
    console.log('Match buddy: ', matchedPerson);
    console.log('User Id of person matched:', matchedPerson.getUserId);
    this.findBuddyQuery.addMatches(matchedPerson.getUserId);
    if(matchedPerson.checkMatches(this.currentUser.getUserId)){
      this.createChat(this.currentUser.getUserId, matchedPerson.getUserId);
    }
    if (this.potentialMatches.length === 0) {
      this.displayNoMoreMatches();
    }
  }

  // public async unmatchBuddy() {
  //   this.recommendedUser=this.recommendationEngine.pollMatch();
  //   if(!this.recommendedUser){
  //     this.displayNoMoreMatches();
  //   }
  //   else{
  //     console.log('UnMatch Buddy');
  //     this.findBuddyQuery.addUnmatches(this.recommendedUser.getUserId);
  //   }
  // }

  public async unmatchBuddy() {
    //ion cards are displayed from the last element of array to first.
    const unmatchedPerson = this.potentialMatches.pop(); //remove last element of array
    console.log('Unmatch buddy: ', unmatchedPerson);
    this.findBuddyQuery.addUnmatches(unmatchedPerson.getUserId);
    if (this.potentialMatches.length === 0) {
      this.displayNoMoreMatches();
    }
  }

  //Display something and prevent the user from matching and unmatching
  private displayNoMoreMatches() {
    console.log('No more matches');
  }

  //this should probably be in a seperate class -> i just put this here as a placeholder
  private createChat(userId1: string , userId2: string) {
    this.findBuddyQuery.createChatQuery(userId1, userId2);
    console.log('Chat created');
  }


}
