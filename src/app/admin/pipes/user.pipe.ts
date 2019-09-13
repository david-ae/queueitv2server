import { Pipe, PipeTransform } from '@angular/core';
import { UserVO } from 'src/app/valueobjects/userVO';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  transform(users: UserVO[], searchText: any): any {
    if(searchText == null)
        return users;
    
    return users.filter(function(user){
        return (user.firstname.toLowerCase().indexOf(searchText.toLowerCase())> -1)
        || (user.lastname.toLowerCase().indexOf(searchText.toLowerCase())> -1)
        || (user.email.toLowerCase().indexOf(searchText.toLowerCase())> -1)
    });
  }

}
