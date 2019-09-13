export class UserVO{
    roles: string[];
    lastname: string;
    firstname: string;
    email: string;
    identity: any;
    userType: string;
    legacyId: string;
    isActive: boolean;

    constructor(){
        this.roles = [];
    }
}