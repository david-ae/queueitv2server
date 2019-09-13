import { TransactionActivityItem } from './tellertransactionitem';
import { TellerTransactionActivity } from '../displaymodels/telleractivitybreakdown';
import { observable, action, computed } from 'mobx';

export class TellerReportSystem {
   @observable Activities: TransactionActivityItem[];
   NumberOfItems: number;
   Total:number;
   @observable activitiesByStatus = [];

   constructor(){
       this.Activities = [];
       this.NumberOfItems = 0;
       this.Total = 0;
       this.activitiesByStatus = [];
   }

   IsExistingInReport(tellerId: string): boolean{
        this.Activities.forEach(teller => {
            if(teller.getTellerId() == tellerId){
                return true;
            }
        });

        return false;
   }

   addItem(activity: TellerTransactionActivity){
       let newItem:boolean = true;

       for(var i = 0; i < this.Activities.length; i++){
           if(this.Activities[i].activity.tellerId === activity.tellerId){
               newItem = false;
               this.Activities[i].incrementCount();
           }
       }

       if(newItem){
          let teller = new TransactionActivityItem(activity);
          this.Activities.push(teller);
       }
   }

    @action addItemWithQuantity(activity: TellerTransactionActivity, amount: number){
       let newItem:boolean = true;
       for(var i = 0; i < this.Activities.length; i++){
           if(this.Activities[i].activity.tellerId === activity.tellerId){
               newItem = false;
               this.Activities[i].incrementCount();
               this.Activities[i].incrementAmountProcessed(amount);
           }
       }

       if(newItem){
          let _activity = new TransactionActivityItem(activity);
          _activity.incrementCount();
          _activity.incrementAmountProcessed(amount);
          this.Activities.push(_activity);
       }
   }

   @action update(activity: TellerTransactionActivity, count:number){
       if(count >= 0){
           let teller: TransactionActivityItem = null;
                       
           for(var i = 0; i < this.Activities.length; i++){
               if(this.Activities[i].activity.tellerId === activity.tellerId){
                   if(count !== 0){
                       this.Activities[i].setCount(count);
                   }
                   else{
                       teller = this.Activities[i];
                       break;
                   }
               }
           }

           if(teller !== null){
               this.Activities.splice(i, 1);
           }
       }
   }

   getItems(): Array<TransactionActivityItem>{
       return this.Activities;
   }

   getNumberOfItems(): number{
       this.NumberOfItems = 0;

       for(var i = 0; i < this.Activities.length; i++){
           this.NumberOfItems += this.Activities[i].getCount();
       }

       return this.NumberOfItems;
   }

   @computed get getActivitiesByStatus(): TransactionActivityItem[]{
       return this.activitiesByStatus;
   }

   @action setActivitiesByStatus(status: string): TransactionActivityItem[]{       
       this.Activities.forEach(activity => {
           if(activity.getTransactionStatus() == status){
               this.activitiesByStatus.push(activity);
               console.log(this.activitiesByStatus.length);
               return this.activitiesByStatus;
           }
       });

       return null;
   }

   getTotal(){
       return this.Total;
   }

   clear(){
       this.Activities = [];
       this.NumberOfItems = 0;
       this.Total = 0;
   }
}