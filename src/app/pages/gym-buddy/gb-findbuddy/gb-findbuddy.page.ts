import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecommendationEngine } from './RecommendationEngine';
import { FindBuddyQuery } from './FindBuddyQuery';
import { DbRetrieveService } from './../../../services/db-retrieve.service';
import { GymBuddyProfileInfo } from './GymBuddyInformation';
import { threadId } from 'worker_threads';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-gb-findbuddy',
  templateUrl: './gb-findbuddy.page.html',
  styleUrls: ['./gb-findbuddy.page.scss'],
})
export class GbFindbuddyPage implements OnInit {

  constructor(
    private loadingController: LoadingController,
    private router: Router,
    private dbRetrieve: DbRetrieveService,
  ) { }

  async ngOnInit() {
    const userInfo= await this.dbRetrieve.retrieveCurrentUser();
    const recommendationEngine = new RecommendationEngine(this.dbRetrieve,userInfo);
    const findBuddy= new FindBuddyQuery(this.dbRetrieve,userInfo.getGender,userInfo.getPrefBuddyGender);
    let arrayofProfile = await findBuddy.findBuddyQuery();
    recommendationEngine.getAllMatches(arrayofProfile);
    const idRecommendations: string[] = [];
    //loop to constantly get the array of recommendations.
    while (true) {
      const idToDisplay = recommendationEngine.pollMatch();
      if (idToDisplay === null) {
        break;
      }
      //use highestscoreid to poll for the user to recommend
      //extract all info and display to html.
      console.log(idToDisplay);

      idRecommendations.push(idToDisplay);
    }
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
    return "Joshua Wang";
  }

  public get getAge() {
    return "26";
  }

  public get getDescription() {
    return "Full time student at NTU";
  }

  async matchBuddy() {
    console.log("Match buddy")
  }

  async unmatchBuddy() {
    console.log("Unmatch buddy")
  }

}
