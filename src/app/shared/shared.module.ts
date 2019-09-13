import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from './_services';
import { AlertComponent } from './_directives';
import { FeatherModule } from 'angular-feather';
import { Menu, Camera, Heart, Github, 
  Calendar, Archive, AtSign, BarChart2 ,
  BookOpen, Check, Cloud, Award,
  Bell, Book, ChevronRight, ChevronLeft,
  Home, Clock, Coffee, Database,
  Download, Edit3, Delete, Activity,
  Filter, File, Folder, User, 
  Settings, Server, Save, Search,
  Send, Share2, Star, Sun, Edit, 
  MinusCircle, LogOut, LogIn,
  Grid,UserCheck, Map
} from 'angular-feather/icons';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { MobxAngularModule } from 'mobx-angular';
import { OperationsFacade } from '../services/operations/operationsfacade';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

const icons = {
  Menu,
  MinusCircle,
  Home,
  Edit,
  LogIn,
  Map,
  Camera,
  User,
  LogOut,
  UserCheck,
  Heart,
  ChevronRight,
  Github,
  Book,
  AtSign,
  Award,
  Filter,
  Database,
  Settings,
  Activity,
  BookOpen
}

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    NgbModule,
    RouterModule,
    MobxAngularModule,
    NgxPaginationModule,
    FeatherModule.pick(icons)
  ],
  declarations: [AlertComponent],
  exports:[AlertComponent, FeatherModule, NgxSpinnerModule,
          NgbModule, NgxPaginationModule, MobxAngularModule],
  providers: [AlertService, NgxSpinnerModule, OperationsFacade]
})
export class SharedModule { }
