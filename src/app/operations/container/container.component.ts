import { Component, OnInit } from '@angular/core';
import { UserAccess } from './../../services/authentication/usersAccess';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  date: any;
  
  constructor(public userAccess: UserAccess, private authService: AuthService, private _router: Router) { }

  ngOnInit() {
    this.date = new Date().getFullYear();
  }

  logout(){
    this.authService.logout();
    this.userAccess.auth = false;
    this.userAccess.isSeniorTeller = false;
    this.userAccess.isTeller = false;
    this.userAccess.isTransactionalTeller = false;
    this._router.navigate(['admin/login']);
  }

}
