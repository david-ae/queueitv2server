export class Accounts{
    identity: string;
    password: string;
    username: string;
    lastname: string;
    firstname: string;
    roles: string[];

    constructor(){
        this.roles = [];
    }
}