import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { filterWorkoutList } from 'src/app/data/workout-data/FilterWorkout';
import { tags } from 'src/app/data/workout-data/CreateWorkout';
import { User } from 'src/app/class/user';
import { UserService } from 'src/app/services/user.service';
import { WorkoutsService } from 'src/app/services/workouts/workouts.service';
import { CreateWorkoutComponent } from '../../../components/create-workout/create-workout.component';

@Component({
  selector: 'app-list-workouts',
  templateUrl: './list-workouts.page.html',
  styleUrls: ['./list-workouts.page.scss'],
})
/**
 * List the workouts created by the user
 */
export class ListWorkoutsPage implements OnInit {
  private allWorkouts = [];
  private filterBy: any;
  private filterWOList = filterWorkoutList;
  private ishidden = true;
  private tagText = 'Show Tags';
  private userInfo: User;
  private workouts = [];
  private workoutTags = tags;

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private loadingController: LoadingController,
    private workoutService: WorkoutsService,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) { }

  /**
   * getter method for the user ID
   */
  get getUserID() {
    return this.userInfo.id;
  }

  async createWorkout() {
    const modal = await this.modalController.create({
      component: CreateWorkoutComponent,
      cssClass: 'createWO',
      componentProps: { userInfo: this.userInfo }
      // backdropDismiss: false,
    });
    return await modal.present();
  }

  /**
   * navigate user to edit their workout
   *
   * @param wid workout id
   * @param uid user id
   */
  async editWorkout(wid, uid) {
    await this.router.navigate(['/tabs/workouts/edit-workout'], { queryParams: { wid, uid } });
  }

  /**
   * 	Fired when the component routing to is about to animate into view.
   */
  async ionViewWillEnter() {
    console.log('ion view enter');
    await this.loadUserWorkouts(JSON.parse(localStorage.getItem('userID')));
    this.filterWorkout('all');
  }

 /**
  * load user info from user service
  */
  async loadUserDetails() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.userService.getUserById(JSON.parse(localStorage.getItem('userID'))).subscribe((res) => {
      this.userInfo = res;
      loading.dismiss();
    });
  }

  /**
   * Function to laod all workouts created by user,
   * all workouts are pushed into an array to be displayed
   *
   * @param id user id
   */
  async loadUserWorkouts(id) {
    this.workouts = [];
    const res = await this.workoutService.getAllWorkout(id);
    (await res).forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const workout = doc.data();
      workout.id = doc.id;
      this.workouts.push(workout);
    });

    this.allWorkouts = this.workouts;
  }

  ngOnInit() {
    this.loadUserDetails();

  }

  /**
   * alert dialog that presents users with 2 options
   * cancel: do not delete workout
   * yes: confirm delete workout
   *
   * @param wid workout id
   * @param uid user id
   */
  async presentAlertConfirm(wid, uid) {
    const alert = await this.alertController.create({
      cssClass: 'delete-workout-alert',
      header: 'Delete Workout',
      message: 'Are you sure you want to delete the workout created for <strong>YOU</strong>?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            this.workoutService.deleteWorkout(wid, uid);
            this.loadUserWorkouts(uid);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * An Action Sheet is a dialog that displays a set of options.
   * Start: user is able to start workout or continue their workout
   * Edit: edit workout
   * Delete: delete workout
   *
   * @param id workout id
   */
  async workoutAction(id) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'workout-action',
      buttons: [{
        text: 'Start',
        handler: () => {
          console.log('Start clicked');
          this.startWorkout(id, this.userInfo.id);
        }
      }, {
        text: 'Edit',
        handler: () => {
          console.log('Play clicked');
          this.editWorkout(id, this.userInfo.id);
        }
      }, {
        text: 'Delete',
        role: 'destructive',
        id: 'delete-button',
        data: {
          type: 'delete'
        },
        handler: () => {
          console.log('Delete clicked');
          this.deleteWorkout(id, this.userInfo.id);
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  /**
   * Prompt user an alert to confirm deletion of workout
   *
   * @param wid workout id
   * @param uid user id
   */
   private deleteWorkout(wid, uid) {
    this.presentAlertConfirm(wid, uid);
  }

  /**
   * filter workouts based on user selection
   *
   * @param filter filter option
   */
  private filterWorkout(filter) {
    this.workouts = this.allWorkouts;
    this.filterBy = filter;

    if (this.filterBy == 'not_started') {
      this.workouts = this.workouts.filter(a => a.workoutStatus == 'created');
    } else if (this.filterBy == 'in_progress') {
      this.workouts = this.workouts.filter(a => a.workoutStatus == 'in_progress');
    } else if (this.filterBy == 'completed') {
      this.workouts = this.workouts.filter(a => a.workoutStatus == 'completed');
    } else if (this.filterBy == 'buddy') {
      this.workouts = this.workouts.filter(a => a.createdBy !== this.userInfo.id);
    } else {
      this.workouts = this.allWorkouts;
    }
  }

  /**
   * function to check if workout is created by user's buddy
   *
   * @param wo workout details
   */
  private getBuddyClass(wo) {
    if (wo.createdBy != this.userInfo.id) {
      return 'buddy';
    }
  }

  /**
   * function to format date
   *
   * @param date
   */
  private getDate(date) {
    if (date) {
      const newDate = new Date(date.seconds * 1000);
      const mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      const strDate = newDate.getDate() + ' ' + mS[newDate.getMonth()] + ' ' + newDate.getFullYear();
      return strDate;
    } return '';
  }

  /**
   * function returns tag text
   *
   * @param tag tag value
   */
  private getTagText(tag) {
    return this.workoutTags.find(t => t.value === tag);
  }

  /**
   * fucntion to show/hide tags
   */
  private showTags() {
    if (this.ishidden) {
      this.ishidden = false;
      this.tagText = 'Hide Tags';
    } else {
      this.ishidden = true;
      this.tagText = 'Show Tags';
    }
  }

  /**
   * navigate user to start their workout
   *
   * @param wid workout id
   * @param uid user id
   */
     private startWorkout(wid, uid) {
      this.router.navigate(['/start-workout'], { queryParams: { wid, uid } });
    }

}
