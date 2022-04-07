import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GymBuddyService } from '../services/gym-buddy.service';

@Injectable({
  providedIn: 'root'
})
export class GymBuddyGuard implements CanActivate {
  constructor(private router: Router, private gymBuddyService: GymBuddyService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // return true if use is authenticated
    console.log(this.gymBuddyService.isSignedUp())
      if (this.gymBuddyService.isSignedUp()){
        return true;
      } else {
        // else redirect the user to another route and return false.
        this.router.navigate(['tabs/gym-buddy/gb-sign-up']);
        return false;
      }
  }

}
