import { TellerTransactionActivity } from '../displaymodels/telleractivitybreakdown';

export class TransactionActivityItem{
    activity: TellerTransactionActivity;

    constructor(activity: TellerTransactionActivity){
        this.activity = activity;
        this.activity.count = 0;
        this.activity.amountProcessed = 0;
    }

    getActivity(): TellerTransactionActivity{
        return this.activity;
    }

    getCount(): number{
        return this.activity.count;
    }

    setCount(qty:number){
        this.activity.count = qty;
    }

    getTellerFullName(): string{
        return this.activity.tellerFullName;
    }

    getTransactionStatus(): string{
        return this.activity.status;
    }

    getTellerId(): string{
        return this.activity.tellerId;
    }

    setTellerId(tellerId:string){
        this.activity.tellerId = tellerId;
    }

    incrementCount(){
        this.activity.count++;
    }

    getAmountProcessed(): number{
        return this.activity.amountProcessed;
    }

    setAmount(amount:number){
        this.activity.amountProcessed = amount;
    }

    incrementAmountProcessed(amount: number){
        this.activity.amountProcessed += amount;
    }

    getTotalCollected(){
        this.activity.amountProcessed;
    }
}