import { Outlet } from "./interfaces/outlet";

export class OutletImp extends Outlet{
    tellers: string[];
    constructor(){
        super();      
        this.tellers = [];  
    }
}