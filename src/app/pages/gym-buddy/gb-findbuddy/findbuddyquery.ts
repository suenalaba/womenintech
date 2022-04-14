
import { DbRetrieveService } from './../../../services/db-retrieve.service';
import { GymBuddyProfileInfo } from './GymBuddyInformation';


export class FindBuddyQuery {

  private currentUser: GymBuddyProfileInfo;
  private dbRetrieve: DbRetrieveService;
  private gender;
  private preferredGender;
  constructor(dbRetrieve: DbRetrieveService, currentUser: GymBuddyProfileInfo) {
    this.dbRetrieve = dbRetrieve;
    this.currentUser = currentUser;
    this.gender=this.currentUser.getGender;
    this.preferredGender=this.currentUser.getPrefBuddyGender;
  }

/**
 * Calls DBRetrieveService to create new a new chat
 *
 * @param currentUserId
 * @param recommendedUserId
 */
  public createChatQuery(currentUserId: string, recommendedUserId: string) {
    this.dbRetrieve.createChatInFireStore(currentUserId, recommendedUserId);
  }

  /**
   *Updates user profile with new matches
   *
   * @param userID
   */
  public addMatches(userID: string){
    this.currentUser.addMatches(userID);
    this.dbRetrieve.updateMatches(this.currentUser,userID);
  }

  /**
   *Updates user profile with new unmatches
   *
   * @param userID
   */
  public addUnmatches(userID: string){
    this.currentUser.addUnmatches(userID);
    this.dbRetrieve.updateUnMatches(this.currentUser,userID);
  }

/**
 *Generates dictionary of relevant gym buddy profiles
 *
 * @returns dictionary of userID and gym buddy profiles
 */
  public async findBuddyQuery() {
    const dictOfProfile = await this.dbRetrieve.findBuddiesFromDB(this.preferredGender,this.gender);
    this.filterDictionary(dictOfProfile);
    return dictOfProfile;
  }
/**
 *Filters out profiles that have been previously
 *matched/unmatched with
 *
 * @param dict of userID and GymBuddyProfiles
 */
  private filterDictionary(dict: Map<string, GymBuddyProfileInfo>){
    this.currentUser.matches.forEach(function(value) {
      delete dict[value];
    });
    this.currentUser.unmatches.forEach(function(value) {
      delete dict[value];
    });
  }
}
