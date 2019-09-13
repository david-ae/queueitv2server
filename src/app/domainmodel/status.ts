import { UserVO } from "../valueobjects/userVO";

export class Status{
    id: string;
    name: string;

    changeName(name: string){
        this.name = name;
    }
}