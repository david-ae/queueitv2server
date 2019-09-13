import { observable, computed, action } from 'mobx';
import { UserVO } from 'src/app/valueobjects/userVO';

export class UserFacade{
    @observable users: UserVO[] = [];
    @observable user: UserVO = new UserVO();
    @observable error: string = null;
    
    @computed get getUsers(){
        return this.users;
    }

    @action getUser(id: string){
        let _user = this.users.find(u => u.identity == id);
        if(_user != null){
            return _user;
        }
        return null;
    }

    @action updateUser(user: UserVO){
        this.users.forEach(iuser => {
            if(iuser.identity == user.identity){
                iuser.email = user.email;
                iuser.firstname = user.firstname;
                iuser.lastname = user.lastname;
            }
        });
    }
}