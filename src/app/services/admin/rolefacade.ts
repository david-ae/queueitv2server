import { Injectable } from '@angular/core';
import { observable, action, autorun, computed } from 'mobx'
import { Role } from '../../domainmodel/role';
import { GeneralService } from 'src/app/admin/services/general.service';

@Injectable()
export class RoleFacade{
    @observable roles: Role[];
    @observable role: Role;

    constructor(private _generalService: GeneralService){
        this.roles = [];
        this.role = new Role();
        autorun(() => {
            this._generalService.getRoles()
                .subscribe((data: Role[]) => {
                    this.roles = data;
                });
        });
    }

    @computed get getAllRoles(): Role[]{        
        return this.roles;
    }

    @action getRole(id: string){
        var role  = this.roles.find( r => r.id == id);
        if(role != null){
            return role;
        }
        return null;
    }

    @action updateRole(role: Role){
        this.roles.forEach(element => {
            if(element.id == role.id){
                element.name = role.name;
            }
        });
    }
}