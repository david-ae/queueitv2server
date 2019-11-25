import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/admin/services/auth.service';
import { UserAccess } from './usersAccess';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private userAccess: UserAccess){}

  canActivate(): boolean{
    let status = this.authService.isLoggedIn();

    if(status == false){
      this.userAccess.auth = false;
      this.router.navigate(['admin/login']);
      return false;
    }

    return true;
  }
  
}
