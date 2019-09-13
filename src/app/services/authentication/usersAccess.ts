import { Injectable } from '@angular/core';
import { observable, action } from 'mobx';
import { UserVO } from 'src/app/valueobjects/userVO';

Injectable()
export class UserAccess{
    @observable users: UserVO[];
    @observable user: UserVO;
    @observable isAdmin: boolean;
    @observable isTeller: boolean;
    @observable isTransactionalTeller: boolean;
    @observable isSeniorTeller: boolean;

    constructor(){
        this.user = new UserVO();
        this.users = [];
        this.isAdmin = false;
        this.isTransactionalTeller = false;
        this.isSeniorTeller = false;
        this.isTeller = false;
    }

    isHasMoreThanOneRole(roles: string[]): boolean{
        if(roles.length > 1){
            return true;
        }
        return false;
    }
    
    @action accessibleRoute(role: string): string{
        if(role == "ADMIN"){
            this.isAdmin = true;
            return 'admin';
        }
        else if(role == "SENIOR TELLER"){
            this.isSeniorTeller = true;
            return "operations/process-transactions";
        }
        else if( role == "TELLER"){
            this.isTeller = true;
            return "operations/process-jobs";
        }
        else if( role == "TRANSACTIONAL TELLER"){
            this.isTransactionalTeller = true;
            return "operations/process-jobs";
        }
        else{
            this.isTeller = true;
            return "operations/process-jobs";
        }
    }
}