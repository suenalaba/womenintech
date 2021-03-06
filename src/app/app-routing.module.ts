import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate,
} from '@angular/fire/auth-guard';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['tabs']);
const redirectUnauthorizedToSignUp = () => redirectUnauthorizedTo(['']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/accounts/login/login.module').then((m) => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'accounts/sign-up',
    loadChildren: () => import('./pages/accounts/sign-up/sign-up.module').then(m => m.SignUpPageModule)
  },
  {
    path: 'accounts/boarding',
    loadChildren: () => import('./pages/accounts/boarding/boarding.module').then(m => m.BoardingPageModule)
  },
  {
    path: 'user-details',
    loadChildren: () => import('./pages/accounts/user-details/user-details.module').then( m => m.UserDetailsPageModule),
    ...canActivate(redirectUnauthorizedToSignUp),
  },
  {
    path: 'edit-workout',
    loadChildren: () => import('./pages/workouts/edit-workout/edit-workout.module').then( m => m.EditWorkoutPageModule)
  },
  {
    path: 'display-gyms',
    loadChildren: () => import('./pages/workouts/display-gyms/display-gyms.module').then( m => m.DisplayGymsPageModule)
  },
  {
    path: 'start-workout',
    loadChildren: () => import('./pages/workouts/start-workout/start-workout.module').then( m => m.StartWorkoutPageModule)
  },
  {
    path: 'workout-summary',
    loadChildren: () => import('./pages/workouts/workout-summary/workout-summary.module').then( m => m.WorkoutSummaryPageModule)
  },
  {
    path: 'stats',
    loadChildren: () => import('./pages/completedworkouts/completedworkouts.module').then( m => m.CompletedWorkoutsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
