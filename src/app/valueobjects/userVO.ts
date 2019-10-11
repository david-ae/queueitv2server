export class UserVO{
    roles: string[];
    lastname: string;
    firstname: string;
    email: string;
    identity: string;
    userType: string;
    legacyId: string;
    isActive: boolean;

    constructor(){
        this.roles = [];
    }
}