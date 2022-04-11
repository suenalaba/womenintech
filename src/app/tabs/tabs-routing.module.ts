import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GymBuddyGuard } from '../guards/gym-buddy.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'workouts',
        children: [{
          path: '',
          loadChildren: () => import('../pages/workouts/list-workouts/list-workouts.module').then(m => m.ListWorkoutsPageModule)
        },
        {
          path:'create-workout',
          loadChildren: () => import('../pages/workouts/create-workouts/create-workouts.module').then(m => m.CreateWorkoutsPageModule)
        },
        {
          path:'generate-workout',
          loadChildren: () => import('../pages/workouts/generate-workout/generate-workout.module').then(m => m.GenerateWorkoutPageModule)
        },
        {
          path:'edit-workout',
          loadChildren: () => import('../pages/workouts/edit-workout/edit-workout.module').then(m => m.EditWorkoutPageModule)
        },
        {
          path: 'display-gyms',
          loadChildren: () => import('../pages/workouts/display-gyms/display-gyms.module').then( m => m.DisplayGymsPageModule)
        }
        ]

      },
      {
        path: 'gym-buddy',
        children: [
          {
            path: '',
            redirectTo: '/tabs/gym-buddy/gb-home',
            pathMatch: 'full'
          },
          {
            path: 'gb-sign-up',
            loadChildren: () => import('../pages/gym-buddy/gb-sign-up/gb-sign-up.module').then(m => m.GbSignUpPageModule),
          },
          {
            path: 'gb-home',
            loadChildren: () => import('../pages/gym-buddy/gb-home/gb-home.module').then(m => m.GbHomePageModule),
            // canActivate: [GymBuddyGuard]
          },
          {
            path: 'gb-buddylist-home',
            loadChildren: () => import('../pages/gym-buddy/gb-buddylist-home/gb-buddylist-home.module').then(
                m => m.GbBuddylistHomePageModule),
          },
          {
            path: 'gb-find-buddy-boarding',
            loadChildren: () => import('../pages/gym-buddy/gb-find-buddy-boarding/gb-find-buddy-boarding.module').then(
                m => m.GbFindBuddyBoardingPageModule),
          },
          {
            path: 'gb-findbuddy',
            loadChildren: () => import('../pages/gym-buddy/gb-findbuddy/gb-findbuddy.module').then(m => m.GbFindbuddyPageModule),

          },
          {
            path: 'gb-chat',
            loadChildren: () => import('../pages/gym-buddy/gb-chat/gb-chat.module').then(m => m.GbChatPageModule),
          },
          {
            path: 'delete-buddy-modal-page',
            loadChildren: () => import('../pages/gym-buddy/gb-delete-buddy-modal/gb-delete-buddy-modal.module').then(
              m => m.GbDeleteBuddyModalPageModule)
          },
        ]
      },
      {
        path: 'settings',
        loadChildren: () => import('../pages/settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
