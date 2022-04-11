import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DbRetrieveService } from 'src/app/services/db-retrieve.service';
import { GymBuddyProfileInfo } from '../gb-findbuddy/GymBuddyInformation';
import { FindBuddyQuery } from '../gb-findbuddy/FindBuddyQuery';
import { RecommendationEngine } from '../gb-findbuddy/RecommendationEngine';
import { GymBuddyService } from 'src/app/services/gym-buddy.service';
@Component({
  selector: 'app-gb-find-buddy-boarding',
  templateUrl: './gb-find-buddy-boarding.page.html',
  styleUrls: ['./gb-find-buddy-boarding.page.scss'],
})
export class GbFindBuddyBoardingPage implements OnInit {

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
    private gbService: GymBuddyService
  ) { }

  async ngOnInit() {
    this.currentUser = this.dbRetrieve.retrieveCurrentUser();
    this.recommendationEngine = new RecommendationEngine(this.currentUser);
    this.findBuddyQuery= new FindBuddyQuery(this.dbRetrieve,this.currentUser);
    this.recommendationEngine.getAllMatches(await this.findBuddyQuery.findBuddyQuery());
    while (true) {
      const potentialMatch: GymBuddyProfileInfo = this.recommendationEngine.pollMatch();
      console.log(potentialMatch);
      if (potentialMatch != null) {
        console.log(potentialMatch);
        //means potential match is not null (still have matches)
        //we use unshift because we want to append to the front,
        //because of how ion card works, it will display the LAST element
        //of the array first, therefore, the person with highest score should be the
        //last element of array so each time, we will add people with lowest score to
        //the front of array, so it will be displayed last.
        this.potentialMatches.unshift(potentialMatch);
      } else {
        console.log('instant chao');
        break;
      }
    }
    this.gbService.setPotentialMatchDetails(this.potentialMatches);
  }

  /**
   * Continue Navigate to find a buddy.
   */
   public async goToFindBuddy() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-findbuddy', { replaceUrl: true });
  }
}
