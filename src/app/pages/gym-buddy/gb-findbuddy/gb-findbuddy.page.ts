import { Component, OnInit, ElementRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FindBuddyQuery } from './FindBuddyQuery';
import { DbRetrieveService } from './../../../services/db-retrieve.service';
import { GymBuddyProfileInfo } from './GymBuddyInformation';
import { GestureController, Platform } from '@ionic/angular';
import { GymBuddyService } from 'src/app/services/gym-buddy.service';
import { IonCard } from '@ionic/angular';


@Component({
  selector: 'app-gb-findbuddy',
  templateUrl: './gb-findbuddy.page.html',
  styleUrls: ['./gb-findbuddy.page.scss'],
})
/**
 * This class is to display the find a buddy page which displays recommendations of buddies to the user based on their profile.
 */
export class GbFindbuddyPage implements OnInit, AfterViewInit {

  /**
   * For Ionic Gestures.
   */
  @ViewChildren(IonCard, { read: ElementRef }) private cards: QueryList<ElementRef>;

 /**
  * An array of potential matches based on the matchmaking algorithm to be displayed to the user.
  */
  public potentialMatches: (GymBuddyProfileInfo)[] = [];
  private currentUser: GymBuddyProfileInfo;
  private findBuddyQuery: FindBuddyQuery;
  private recommendedUser: GymBuddyProfileInfo;

  constructor(
    private router: Router,
    private dbRetrieve: DbRetrieveService,
    private gestureCtrl: GestureController,
    private platform: Platform,
    private gbService: GymBuddyService
  ) { }
  /**
   * Gets the age of the recommended user for display.
   *
   * @returns the age of the recommended user.
   */
   public get getAge() {
    if(this.recommendedUser) {
      return this.recommendedUser.age;
    }
    return 'Age';
  }

  /**
   * Gets the brief intro of the user for display.
   *
   * @returns a text string of the brief intro of the recommended user.
   */
  public get getBriefIntro() {
    if(this.recommendedUser) {
      return this.recommendedUser.getbriefIntro;
    }
    return 'Brief Introduction';
  }

  /**
   * Gets the full name of the recommended user for display.
   *
   * @returns the full name of the recommended user.
   */
  public get getFullName() {
    if(this.recommendedUser) {
      return this.recommendedUser.name;
    }
    return 'Full Name';
  }

  /**
   * Gets the text url of the profile picture for display.
   *
   * @returns a text string of the profile picture url.
   */
  public get getProfilePicture() {
    if(this.recommendedUser) {
      return this.recommendedUser.profilePicture;
    }
    return 'Profile Picture';
  }

  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   *This method is used to handle any additional initialization tasks.
   */
  ngAfterViewInit() {
    const cardArray = this.cards.toArray();
    this.useSwiperGesture(cardArray);
  }

  /**
   * Main entry point to the page that gets called when the class is instantiated.
   * It will populate the list of potential matches to display to the user as cards.
   */
  ngOnInit() {
    this.potentialMatches = this.gbService.getPotentialMatchDetails();
    this.currentUser = this.dbRetrieve.retrieveCurrentUser();
    this.findBuddyQuery= new FindBuddyQuery(this.dbRetrieve,this.currentUser);
    console.log(this.potentialMatches[this.potentialMatches.length - 1].profilePicture);
  }

  /**
   * This method will be called when the user selects to unMatch the buddy.
   * The data will be sent over to find buddy query object so that information will be stored in the back end.
   */
  public async unmatchBuddy() {
    //ion cards are displayed from the last element of array to first.
    const unmatchedPerson = this.potentialMatches.pop(); //remove last element of array
    console.log('Unmatch buddy: ', unmatchedPerson);
    this.findBuddyQuery.addUnmatches(unmatchedPerson.getUserId);
    if (this.potentialMatches.length === 0) {
      this.displayNoMoreMatches();
    }
  }

  /**
   * Allows the user to swipe on the display to match or unMatch the recommended buddy.
   *
   * @param cardArray array of ion cards that contains user information to display.
   */
  public useSwiperGesture(cardArray) {
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

  /**
   *Gets the index of the element to display and returns the corresponding color to display the element.
   *
   * @param i The index of element to display.
   * @returns The color to display for the element.
   */
    public getColor(i: number) {
      i = i % 5;
      const colors = ['#ED93D5','#94DAEC','#FB6175','#EFBCFF','#F2D28A'];
      return colors[i];
    }
    /**
     * Getter for the current user profile as an object.
     *
     * @returns Gym Buddy Profile Info object of the current user.
     */
    public getCurrentUser(): GymBuddyProfileInfo {
      return this.currentUser;
    }
    /**
     * This method is called when the user clicks a button to navigate back to the home page. The router will be called to route the user.
     */
    public async goToGBHome() {
      this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
    }
    /**
     * This method is called when the user selects to match the buddy.
     * The data will be sent over to the find buddy query so that information is stored in the back end.
     * If both users have opted to match a chat will be created.
     */
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


    private createChat(userId1: string , userId2: string) {
      this.findBuddyQuery.createChatQuery(userId1, userId2);
      console.log('Chat created');
    }

    private decimalToHex(d, padding) {
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

    private displayNoMoreMatches() {
      console.log('No more matches');
    }

    /**
     * Sets the card color when the user swipes based on the direction of swipe.
     *
     * @param x the horizontal velocity based on the swiping gesture generated by the user.
     * @param element the card that was swiped.
     */
    private setCardColor(x, element) {
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
}
