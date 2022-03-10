import { GymBuddyProfileInfo } from './GymBuddyInformation';
import { DbRetrieveService } from './../../services/db-retrieve.service';

export class MatchmakingAlgo {

  private static readonly TIME_AND_LOC_PREF_WEIGHTAGE = 10;
  private static readonly GOALS_WEIGHTAGE = 20;
  private static readonly EXPERTISE_AND_STYLE_WEIGHTAGE = 60;
  private static readonly FIVE_SELECTIONS = 5;
  private static readonly TWO_SELECTIONS = 2;
  private static readonly THREE_SELECTIONS = 3;
  private static readonly TRAITS_AND_STYLE_SELECTIONS = 10;
  /* dictionary <userid, matchscore>*/
  //private contentFilterScoreMap: { [key: string]: number} = {};
  /*private contentFilterScoreMap: Record<string, number> = {
    //key1: 'val1',
    //key2: 'val2',
 };*/
 //let scores = new Map<string, number>();
  private contentFilterScoreMap = new Map<string, number>([]);

  constructor(    private dbRetrieve: DbRetrieveService,
    ) {
  }

  public get getContentFilterScoreMap() {
    this.contentFilterScoreMap.forEach((id,scores) => console.log(id,scores))
    return this.contentFilterScoreMap;
  }

  public deleteIdFromContentFilterScoreMap(highestScoreId) {
    this.contentFilterScoreMap.delete(highestScoreId);
  }

  public async calculateMatchingScores(arrayOfProfiles:Array<GymBuddyProfileInfo>) {
    let matchScore;
    let anotherUserId;
    const currentUser=new GymBuddyProfileInfo(JSON.parse(localStorage.getItem('userInfo'))); // placeholder
    /* Pseudo code for Matchmaking Algo
    *  For each value in K:V pair in localStorage(dictionary of documents in app)
    * extract the Value and extract the gymbuddyprofile using json parser
    * each time, creating an object of a gymbuddyprofile.
    * store each object(gymbuddyprofile) inside an array of gymbuddyprofile objects
    * Terminate for loop
    * Run a new for loop, looping through the array of gymbuddyprofile objects
    * calculate the matching score between each user
    * get the string id of the other user
    * store in hashmap <id,matching score>
    * this hashmap is to be used in recommendation engine */
    //calculate matching score
    arrayOfProfiles.forEach(anotherUser => {
      matchScore = this.getTotalMatchScore(currentUser, anotherUser);
      //get id to store
      anotherUserId = anotherUser.getUserId;
      //store to hashmap
      this.contentFilterScoreMap.set(anotherUserId,matchScore);
      //return matchScore;
    });
  }


  private getTotalMatchScore(currentUser: GymBuddyProfileInfo, anotherUser: GymBuddyProfileInfo) {
    let matchScore = 0;
    const timeScore = this.getTimePrefScore(currentUser, anotherUser);
    const goalsScore = this.getGoalsScore(currentUser, anotherUser);
    const traitsStyleScore = this.getTraitsAndStyleScore(currentUser, anotherUser);
    const locationScore = this.getLocationPrefScore(currentUser, anotherUser);
    //tabulate scores
    matchScore = locationScore + traitsStyleScore + goalsScore + timeScore;
    return matchScore;
  }

  private getLocationPrefScore(currentUser: GymBuddyProfileInfo, anotherUser: GymBuddyProfileInfo) {
    let locationScore = 0;
    for (const field of currentUser.getLocationPreference) {
      if (anotherUser.getLocationPreference.includes(field)) {
        locationScore++;
      }
    }
    locationScore = locationScore / MatchmakingAlgo.TWO_SELECTIONS * MatchmakingAlgo.TIME_AND_LOC_PREF_WEIGHTAGE;
    return locationScore;
  }

  private getTraitsAndStyleScore(currentUser: GymBuddyProfileInfo, anotherUser: GymBuddyProfileInfo) {
    let traitsStyleScore = 0;
    /* user A personal traits match with user B preferred traits */
    for (const field of currentUser.getPersonalTraits) {
      if (anotherUser.getBuddyTraits.includes(field)) {
        traitsStyleScore++;
      }
    }
    /* user A personal trainstyle match with User B preferred train style */
    for (const field of currentUser.getPersonalTrainStyle) {
      if (anotherUser.getBuddyTrainStyle.includes(field)) {
        traitsStyleScore++;
      }
    }
    /* user A preferred buddy traits match with User B's personal traits*/
    for (const field of currentUser.getBuddyTraits) {
      if (anotherUser.getPersonalTraits.includes(field)) {
        traitsStyleScore++;
      }
    }
    /* user A preferred buddy train styles match with User B's personal train style */
    for (const field of currentUser.getBuddyTrainStyle) {
      if (anotherUser.getPersonalTrainStyle.includes(field)) {
        traitsStyleScore++;
      }
    }
    traitsStyleScore = traitsStyleScore / MatchmakingAlgo.TRAITS_AND_STYLE_SELECTIONS * MatchmakingAlgo.EXPERTISE_AND_STYLE_WEIGHTAGE;
    return traitsStyleScore;
  }

  private getGoalsScore(currentUser: GymBuddyProfileInfo, anotherUser: GymBuddyProfileInfo) {
    let goalsScore = 0;
    for (const field of currentUser.getGymBuddyGoals) {
      if (anotherUser.getGymBuddyGoals.includes(field)) {
        goalsScore++;
      }
    }
    goalsScore = goalsScore / MatchmakingAlgo.THREE_SELECTIONS * MatchmakingAlgo.GOALS_WEIGHTAGE;
    return goalsScore;
  }

  private getTimePrefScore(currentUser: GymBuddyProfileInfo, anotherUser: GymBuddyProfileInfo) {
    let timeScore = 0;
    /* field refers to array entry */
    for (const field of currentUser.getWorkoutTimePreference) {
      if (anotherUser.getWorkoutTimePreference.includes(field)) {
        timeScore++;
      }
    }
    timeScore = timeScore / MatchmakingAlgo.FIVE_SELECTIONS * MatchmakingAlgo.TIME_AND_LOC_PREF_WEIGHTAGE;
    return timeScore;
  }
}
