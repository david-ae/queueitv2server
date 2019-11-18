export class TellerTransactionActivity{
    tellerId: string;
    tellerFullName: string;
    platenumber: string;
    transactionType: string;
    status: string;
    timeSubmitted: Date;
    timeCompleted: Date;
    count: number;
    amountProcessed: number;

    constructor(){
        this.count = 0;
        this.amountProcessed = 0;
    }
}