import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { children } from 'dom7';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'workouts',
        loadChildren: () => import('../workouts/list-workouts/list-workouts.module').then(m => m.ListWorkoutsPageModule)
      },
      {
        path: 'gym-buddy',
        children: [
          {
            path: 'gb-sign-up',
            loadChildren: () => import('../gym-buddy/gb-sign-up/gb-sign-up.module').then(m => m.GbSignUpPageModule)
          },
          {
            path: 'gb-home',
            loadChildren: () => import('../gym-buddy/gb-home/gb-home.module').then(m => m.GbHomePageModule),
          }
        ]
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
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
