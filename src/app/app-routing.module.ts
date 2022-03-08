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
      import('./accounts/login/login.module').then((m) => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'accounts/sign-up',
    loadChildren: () => import('./accounts/sign-up/sign-up.module').then(m => m.SignUpPageModule)
  },
  {
    path: 'accounts/boarding',
    loadChildren: () => import('./accounts/boarding/boarding.module').then(m => m.BoardingPageModule)
  },
  {
    path: 'user-details',
    loadChildren: () => import('./accounts/user-details/user-details.module').then( m => m.UserDetailsPageModule),
    ...canActivate(redirectUnauthorizedToSignUp),
  },
  /*{
    path: 'gym-buddy/gb-sign-up',
    loadChildren: () => import('./gym-buddy/gb-sign-up/gb-sign-up.module').then( m => m.GbSignUpPageModule),
    ...canActivate(redirectUnauthorizedToSignUp),
  }*/
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
