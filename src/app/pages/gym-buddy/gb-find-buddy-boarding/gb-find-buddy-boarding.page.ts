import { Component, OnInit } from '@angular/core';
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
/**
 * The class is used to initialize the display and contents of the find buddy boarding page and loads user information in the background.
 */
export class GbFindBuddyBoardingPage implements OnInit {

  /**
   * An array of gym buddy profiles suggested by the matching algorithm.
   */
  public potentialMatches: (GymBuddyProfileInfo)[] = [];


  private recommendationEngine;
  private currentUser: GymBuddyProfileInfo;
  private findBuddyQuery: FindBuddyQuery;

  constructor(
    private router: Router,
    private dbRetrieve: DbRetrieveService,
    private gbService: GymBuddyService
  ) { }

  /**
   * Main entry point into the page that runs when the class is instantiated.
   * This method will retrieve user details from the database and instantiates the Recommendation Engine to source for potential matches.
   * The potential matches will then be stored in an array of Gym Buddy Profile objects.
   */
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
        break;
      }
    }
    this.gbService.setPotentialMatchDetails(this.potentialMatches);
  }

  /**
   * This method is called when user selects the button to navigate to find a buddy page.
   * This will route the page to the next page.
   */
   public async goToFindBuddy() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-findbuddy', { replaceUrl: true });
  }
}
