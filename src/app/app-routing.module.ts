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
  },  {
    path: 'gb-chat',
    loadChildren: () => import('./pages/gym-buddy/gb-chat/gb-chat.module').then( m => m.GbChatPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
