import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { User } from 'src/app/class/user';
import { UserService } from 'src/app/services/user.service';
import { CreateWorkoutComponent } from '../../../components/create-workout/create-workout.component';
@Component({
  selector: 'app-list-workouts',
  templateUrl: './list-workouts.page.html',
  styleUrls: ['./list-workouts.page.scss'],
})
export class ListWorkoutsPage implements OnInit {

  private workouts = ['', '', '']
  private userInfo: User;

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private loadingController: LoadingController
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
     loading.dismiss();
   })
  }

}
