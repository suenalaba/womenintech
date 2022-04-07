import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecommendationEngine } from './RecommendationEngine';
import { FindBuddyQuery } from './FindBuddyQuery';
import { DbRetrieveService } from './../../../services/db-retrieve.service';
import { GymBuddyProfileInfo } from './GymBuddyInformation';
import { threadId } from 'worker_threads';
import { LoadingController } from '@ionic/angular';
import { GymBuddyService } from 'src/app/services/gym-buddy.service';

export interface CardData {
  imageId: string;
  state: 'default' | 'flipped' | 'matched';
}

@Component({
  selector: 'app-gb-findbuddy',
  templateUrl: './gb-findbuddy.page.html',
  styleUrls: ['./gb-findbuddy.page.scss'],
})
export class GbFindbuddyPage implements OnInit {
  private recommendationEngine;
  private currentUser: GymBuddyProfileInfo;
  private recommendedUser: GymBuddyProfileInfo;
  private findBuddyQuery: FindBuddyQuery;

  constructor(
    private loadingController: LoadingController,
    private router: Router,
    private dbRetrieve: DbRetrieveService,
  ) { }

  async ngOnInit() {
    this.currentUser = await this.dbRetrieve.retrieveCurrentUser(); //currentUser is an object of GymBuddyProfile
    this.recommendationEngine = new RecommendationEngine(this.currentUser); //recommendation engine object for current user
    this.findBuddyQuery = new FindBuddyQuery(this.dbRetrieve,this.currentUser); //create a find buddy query object
    //to set the content filter score map.
    this.recommendationEngine.getAllMatches(await this.findBuddyQuery.findBuddyQuery()); //parameter is a dictionary of profiles.
    // First user to be displayed, recommended user is the Gym Buddy Profile object of suggested match.
    /*do {
      this.recommendedUser=this.recommendationEngine.pollMatch();
    } while (this.recommendedUser != null); */
    this.recommendedUser = this.recommendationEngine.pollMatch();
  }


  public get getFullName() {
    if(this.recommendedUser)
      return this.recommendedUser.name;
    return "Full name"
  }

  public get getAge() {
    if(this.recommendedUser)
      return this.recommendedUser.age;
    return "Age"
  }

  public get getBriefIntro() {
    if(this.recommendedUser)
      return this.recommendedUser.getbriefIntro;
    return "Brief Introduction"
  }

  public get getProfilePicture() {
    if(this.recommendedUser)
      return this.recommendedUser.profilePicture;
    return "Profile Picture"
  }

  public get getMoreGymBuddyInformation() {
    return "More Information"
  }


  async matchBuddy() {
    this.findBuddyQuery.addMatches(this.recommendedUser.getUserId);
    if(this.recommendedUser.checkMatches(this.currentUser.getUserId)){
          this.createChat(this.recommendedUser.getUserId,this.currentUser.getUserId);
    }
    this.recommendedUser=this.recommendationEngine.pollMatch();
    if(!this.recommendedUser){
      this.displayNoMoreMatches();
    }
    else {
      console.log('Another buddy found');
    }
  }

  async unmatchBuddy() {
    this.findBuddyQuery.addUnmatches(this.recommendedUser.getUserId);
    this.recommendedUser=this.recommendationEngine.pollMatch();
    if(!this.recommendedUser){
      this.displayNoMoreMatches();
    }
    else{
      console.log('UnMatch Buddy');
    }
  }

  async goToGBHome() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
  }

  //Display something and prevent the user from matching and unmatching
  private displayNoMoreMatches() {
    console.log('No more matches');
  }

  //this should probably be in a seperate class -> i just put this here as a placeholder
  private createChat(userID1: string , userID2: string) {
    console.log('Chat created');
  }



}
