import { Injectable } from '@angular/core';
import { observable, action, autorun, computed } from 'mobx'
import { Role } from '../../domainmodel/role';
import { GeneralService } from '../../admin/services/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Status } from '../../domainmodel/status';

@Injectable()
export class StatusFacade{
    @observable statusList: Status[];
    @observable status: Status;

    constructor(private _generalService: GeneralService){
        this.statusList = [];
        this.status = new Status();
        autorun(() => {
            this._generalService.getStatusList()
                .subscribe((data: Status[]) => {
                    this.statusList = data;
                });
        });
    }

    @computed get getAllStatus(): Status[]{        
        return this.statusList;
    }

    @action getStatus(id: string){
        var status = this.status = this.statusList.find( s => s.id == id);
        if(status != null){
            return status;
        }
        return null;
    }

    @action updateStatus(status: Status){
        this.statusList.forEach(element => {
            if(element.id === status.id){
                element.name = status.name;
            }
        });
    }
}