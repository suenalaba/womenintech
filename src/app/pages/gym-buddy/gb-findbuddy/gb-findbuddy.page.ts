import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecommendationEngine } from './RecommendationEngine';
import { FindBuddyQuery } from './FindBuddyQuery';
import { DbRetrieveService } from './../../../services/db-retrieve.service';
import { GymBuddyProfileInfo } from './GymBuddyInformation';
import { threadId } from 'worker_threads';
import { LoadingController } from '@ionic/angular';
import { GymBuddyService } from 'src/app/services/gym-buddy.service';


@Component({
  selector: 'app-gb-findbuddy',
  templateUrl: './gb-findbuddy.page.html',
  styleUrls: ['./gb-findbuddy.page.scss'],
})
export class GbFindbuddyPage implements OnInit {
  private recommendationEngine;
  private currentUser: GymBuddyProfileInfo;
  private recommendedUser: GymBuddyProfileInfo;
  private findBuddyQuery : FindBuddyQuery

  constructor(
    private loadingController: LoadingController,
    private router: Router,
    private dbRetrieve: DbRetrieveService,
    private gbService: GymBuddyService,
  ) { }

  async ngOnInit() {
    this.currentUser= await this.dbRetrieve.retrieveCurrentUser();
    this.recommendationEngine = new RecommendationEngine(this.currentUser);
    this.findBuddyQuery= new FindBuddyQuery(this.dbRetrieve,this.gbService,this.currentUser);
    this.recommendationEngine.getAllMatches(await this.findBuddyQuery.findBuddyQuery());
    // First user to be displayed
    this.recommendedUser=this.recommendationEngine.pollMatch();
  }

    //extract all information from dictionary based on id and store all information in array
    //loop through array in html to display information.

    //when user exits page, destroy all objects.

    //testing some stuff here....
    //var userValidators : IUserValidators = new UserValidators();
    /*const matchmakingAlgo = new MatchmakingAlgo();
    matchmakingAlgo.calculateMatchingScores();
    console.log(score);
    matchmakingAlgo.getContentFilterScoreMap.forEach((id,scores) => console.log(id,scores));*/
    //const test = new Testz();
    //console.log(test.name);
    /*console.log(2/3*20/100);
    let mainuser = new GymBuddyProfileInfo();
    console.log(mainuser.getbriefIntro);
    mainuser.setbriefIntro = 'hellotinysherwin';
    console.log(mainuser.getbriefIntro);
    console.log(mainuser.getBuddyTrainStyle);
    mainuser.updateGymBuddyArrays(mainuser.getBuddyTrainStyle,'test');
    console.log(mainuser.getBuddyTrainStyle);
    mainuser.removeFromGymBuddyArrays(mainuser.getBuddyTrainStyle, 'test');
    console.log(mainuser.getBuddyTrainStyle);*/
  async goToGBHome() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
  }


  public get getFullName() {
    if(this.recommendedUser)
      return this.recommendedUser.name;
    return ""
  }

  public get getAge() {
    if(this.recommendedUser)
      return this.recommendedUser.age;
    return ""
  }

  public get getBriefIntro() {
    if(this.recommendedUser)
      return this.recommendedUser.getbriefIntro;
    return ""
  }

  public get getProfilePicture() {
    if(this.recommendedUser)
      return this.recommendedUser.profilePicture;
    return ""
  }

  async matchBuddy() {
    this.recommendedUser=this.recommendationEngine.pollMatch();
    this.findBuddyQuery.addMatches(this.recommendedUser.getUserId);
    if(!this.recommendedUser){
      this.displayNoMoreMatches();
    }
    else console.log("Match buddy")
  }

  async unmatchBuddy() {
    this.recommendedUser=this.recommendationEngine.pollMatch();
    this.findBuddyQuery.addUnmatches(this.recommendedUser.getUserId);
    if(!this.recommendedUser){
      this.displayNoMoreMatches();
    }
    else console.log("Unmatch buddy")
  }

  //Display something and prevent the user from matching and unmatching
  private displayNoMoreMatches() {
    console.log("No More Matches")
  }

}
