import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-gb-delete-buddy-modal',
  templateUrl: './gb-delete-buddy-modal.page.html',
  styleUrls: ['./gb-delete-buddy-modal.page.scss'],
})
export class GbDeleteBuddyModalPage implements OnInit {

  private optionList = ['Return to chat', 'Proceed to delete'];


  constructor(private modalController: ModalController) { }

  public get getOptionList() {
    return this.optionList;
  }

  ngOnInit() {
  }

  // public async navigateToNext(option: string) {
  //   if (option === 'Proceed to delete') {
  //     console.log('Deleted');
  //     //do stuff to delete
  //     //navigate to gym buddy home.
  //   } else {
  //     //navigate back to chat.
  //   }
  // }

  public async navigateBack(response: string) {
    //navigate back to chat.
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let isChoiceDelete: boolean;
    if (response === 'Proceed to delete') {
      isChoiceDelete = true;
    } else {
      isChoiceDelete = false;
    }
    await this.modalController.dismiss(isChoiceDelete);
  }

  public getColorOfButton(option: string): string {
    if(option === 'Proceed to delete') {
      return 'danger';
    } else {
      return 'success';
    }
  }


}
