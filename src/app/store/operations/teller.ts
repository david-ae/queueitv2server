import { observable, computed, action } from 'mobx';
import { UserVO } from 'src/app/valueobjects/userVO';
import { Injectable } from '@angular/core';
import { Accounts } from 'src/app/valueobjects/accountvo';

@Injectable()
export class TellerStore{
    @observable seniortellers: Accounts[] = [];
    @observable tellers: Accounts[] = [];
    @observable teller: Accounts = new Accounts();
    @observable tellersUserVO: UserVO[] = [];
    @observable seniorTellersUserVO: UserVO[] = [];

    constructor(){}

    @computed get getTellerList(){
        return this.tellers;
    }

    @computed get getSeniorTellerList(){
        return this.seniortellers;
    }

    @computed get getTellerUserrVOList(){
        return this.tellersUserVO;
    }

    @computed get getSeniorTellerUserVOList(){
        return this.seniorTellersUserVO;
    }

    @action getTellerUserVOById(id: string){
        var teller = this.tellersUserVO.find(t => t.identity == id);
        if(teller != null){
            return teller;
        }
        return teller;
    }

    @action getTellersFromTellerList(tellers: UserVO[]){
        this.tellersUserVO = tellers.filter(teller => teller.roles.find(role => role == "TELLER"));
    }
    
    @action getTellerById(id: string){
        var teller = this.tellers.find(t => t.identity == id);
        if(teller != null){
            return teller;
        }
        return teller;
    }

    @computed get getAccountsUserVOEquivalent(){
        return this.tellersUserVO;
    }

    @action turnAccountsToUserVO(accounts: Accounts[]){
        accounts.forEach(account => {
            var userVo = new UserVO();
            userVo.email = account.username;
            userVo.firstname = account.firstname;
            userVo.lastname = account.lastname;
            userVo.roles = account.roles;
            userVo.identity = account.identity;
            this.tellersUserVO.push(userVo);
        });        
    }
}