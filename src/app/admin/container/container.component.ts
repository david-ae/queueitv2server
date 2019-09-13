import { Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import { UserAccess } from './../services/userAccess';
import { AuthService } from 'src/app/admin/services/auth.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit{
  con: boolean = false;
  constructor(public userAccess: UserAccess, private authService: AuthService,
    private _router: Router) { }

  ngOnInit(){    
  }

  logout(){
    this.authService.logout();
    this.userAccess.auth = false;
    this._router.navigate(['admin/login']);
  }
}
