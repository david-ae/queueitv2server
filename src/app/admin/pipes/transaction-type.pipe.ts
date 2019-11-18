import { Pipe, PipeTransform } from '@angular/core';
import { TransactionType } from 'src/app/domainmodel/transactiontype';
import { TellerTransactionActivity } from 'src/app/services/admin/displaymodels/telleractivitybreakdown';

@Pipe({
  name: 'transactionType'
})
export class TransactionTypePipe implements PipeTransform {

  transform(transactionActivity: TellerTransactionActivity[], searchText: any): any {
    // if(searchText == null)
    //     return transactionActivity;
    
    // return transactionActivity.filter(function(activity){
    //     return (activity.status.toLowerCase().indexOf(searchText.toLowerCase())> -1)
    // });
  }

}
