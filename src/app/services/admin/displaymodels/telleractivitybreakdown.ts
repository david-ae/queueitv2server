export class TellerTransactionActivity{
    tellerId: string;
    tellerFullName: string;
    platenumber: string;
    status: string;
    count: number;
    amountProcessed: number;

    constructor(){
        this.count = 0;
        this.amountProcessed = 0;
    }
}