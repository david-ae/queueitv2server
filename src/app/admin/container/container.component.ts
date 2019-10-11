import { Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import { UserAccess } from './../../services/authentication/usersAccess';
import { AuthService } from 'src/app/admin/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit{
  constructor(public userAccess: UserAccess, private authService: AuthService,
    private _router: Router) { }

  ngOnInit(){  
  }

  logout(){
    this.authService.logout();
    this.userAccess.auth = false;
    this.userAccess.isAdmin = false;
    this._router.navigate(['admin/login']);
  }
}
