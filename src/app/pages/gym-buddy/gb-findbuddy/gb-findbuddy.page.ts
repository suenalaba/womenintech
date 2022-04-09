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

  async ngOnInit() {
    this.currentUser = this.dbRetrieve.retrieveCurrentUser();
    this.recommendationEngine = new RecommendationEngine(this.currentUser);
    this.findBuddyQuery= new FindBuddyQuery(this.dbRetrieve,this.currentUser);
    this.recommendationEngine.getAllMatches(await this.findBuddyQuery.findBuddyQuery());
    // First user to be displayed
    this.recommendedUser=this.recommendationEngine.pollMatch();
  }


  public getCurrentUser(): GymBuddyProfileInfo {
    return this.currentUser;
  }




  public async goToGBHome() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
  }

  public async matchBuddy() {
    this.findBuddyQuery.addMatches(this.recommendedUser.getUserId);
    if(this.recommendedUser.checkMatches(this.currentUser.getUserId)){
          this.createChat(this.currentUser.getUserId, this.recommendedUser.getUserId);
    }
    this.recommendedUser=this.recommendationEngine.pollMatch();
    if(!this.recommendedUser){
      this.displayNoMoreMatches();
    }
    else {
      console.log('Match Buddy');
    }
  }

  public async unmatchBuddy() {
    this.recommendedUser=this.recommendationEngine.pollMatch();
    if(!this.recommendedUser){
      this.displayNoMoreMatches();
    }
    else{
      console.log('UnMatch Buddy');
      this.findBuddyQuery.addUnmatches(this.recommendedUser.getUserId);
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
