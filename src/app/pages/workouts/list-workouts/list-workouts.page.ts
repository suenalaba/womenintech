import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { docData } from 'rxfire/firestore';
import { WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { User } from 'src/app/class/user';
import { UserService } from 'src/app/services/user.service';
import { WorkoutsService } from 'src/app/services/workouts.service';
import { CreateWorkoutComponent } from '../../../components/create-workout/create-workout.component';
@Component({
  selector: 'app-list-workouts',
  templateUrl: './list-workouts.page.html',
  styleUrls: ['./list-workouts.page.scss'],
})
export class ListWorkoutsPage implements OnInit {

  private workouts = [];
  private userInfo: User;

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private loadingController: LoadingController,
    private workoutService: WorkoutsService,
    private router: Router,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.loadUserDetails();
    
  }

  async createWorkout(){
    const modal = await this.modalController.create({
      component: CreateWorkoutComponent,
      cssClass: 'createWO',
      componentProps: { userInfo: this.userInfo }
      // backdropDismiss: false,
    });
    return await modal.present();
  }

   /**
   * 
   * load user info from user service
   */

  async loadUserDetails(){
    const loading = await this.loadingController.create();
   await loading.present();
   this.userService.getUserById(JSON.parse(localStorage.getItem('userID'))).subscribe((res) =>{
      this.userInfo = res;
      this.loadUserWorkouts(this.userInfo.id);
      loading.dismiss();
   })
  }

  ionViewWillEnter(){
    this.loadUserWorkouts(JSON.parse(localStorage.getItem('userID')));
  }

  async loadUserWorkouts(id){
    this.workouts = []
    let res = await this.workoutService.getAllWorkout(id);
    (await res).forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let workout = doc.data();
      workout.id = doc.id;
      this.workouts.push(workout)
    });
  }

  async workoutAction(id) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'workout-action',
      buttons: [{
        text: 'Start',
        handler: () => {
          console.log('Start clicked');
        }
      }, {
        text: 'Edit',
        handler: () => {
          console.log('Play clicked');
          this.editWorkout(id);
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

  async editWorkout(id){
    await this.router.navigate(['/tabs/workouts/edit-workout'], { queryParams: { id: id }});
  }

}
