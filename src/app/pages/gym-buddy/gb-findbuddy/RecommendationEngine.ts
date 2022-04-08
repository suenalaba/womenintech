import { MatchmakingAlgo } from './MatchmakingAlgo';
import { DbRetrieveService } from './../../../services/db-retrieve.service';
import { GymBuddyProfileInfo } from './GymBuddyInformation';


export class RecommendationEngine {

  private matchmakingAlgo: MatchmakingAlgo;
  private userInfo: GymBuddyProfileInfo;
  private dictOfProfiles: Map<string, GymBuddyProfileInfo>;

  constructor(gymBuddyProfileInfo: GymBuddyProfileInfo) {
    this.matchmakingAlgo = new MatchmakingAlgo();
    this.userInfo = gymBuddyProfileInfo;
  }

  /**
   * Get the Gym Buddy Profile that will be suggested because it has the highest matching score.
   *
   * @returns Gym Buddy Profile Object of User with the highest matching score.
   */
  public pollMatch() {
    const contentFilterScoreMap = this.matchmakingAlgo.getContentFilterScoreMap;

    /* returns the match with the highest score */
    const highestScoreId = this.getHighestScoreId(contentFilterScoreMap);

    //remove the match after founds
    this.matchmakingAlgo.deleteIdFromContentFilterScoreMap(highestScoreId);
    if (highestScoreId === '') {
      //if highestScoreId is empty string, means no more matches to return
      return null;
    }
    else {
      return this.dictOfProfiles[highestScoreId];
    }
  }
//if (Object.prototype.hasOwnProperty.call(foo, key))
  public getAllMatches(dictOfProfiles) {
    this.dictOfProfiles = dictOfProfiles;
    const arrayOfProfiles= new Array<GymBuddyProfileInfo>(); //initialize an array to store gym buddy profiles that was queried.
    for (const key in this.dictOfProfiles) {
      //Preventing unexpected behavior that could arise from using a for in loop without filtering the results in the loop.
      if (Object.prototype.hasOwnProperty.call(this.dictOfProfiles,key)) {
        const value = this.dictOfProfiles[key];
        arrayOfProfiles.push(value); //array of profile objects only.
      }
    }
    console.log('array of profiles: ', arrayOfProfiles);
    this.matchmakingAlgo.calculateMatchingScores(this.userInfo,arrayOfProfiles);
    //this.matchmakingAlgo.getContentFilterScoreMap;
  }

  /**
   * Get the Highest Score from the Content Filter Score Map.
   *
   * @param contentFilterScoreMap HashMap of key:Buddy User Id, Value: Score.
   * @returns the user Id of the highest score.
   */
  private getHighestScoreId(contentFilterScoreMap: Map<string, number>) {
    let highestScore = -1;
    let highestScoreId = '';
    contentFilterScoreMap.forEach((matchingScore: number, id: string) => {
      if (matchingScore > highestScore) {
        highestScore = matchingScore;
        highestScoreId = id;
      }
    });
    return highestScoreId;
  }
}
