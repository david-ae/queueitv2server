import { Pipe, PipeTransform } from '@angular/core';
import { Status } from 'src/app/domainmodel/status';
import { TellerTransactionActivity } from 'src/app/services/admin/displaymodels/telleractivitybreakdown';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(transactionActivity: TellerTransactionActivity[], searchText: any): any {
    if(searchText == null)
        return transactionActivity;
    
    return transactionActivity.filter(function(activity){
        return (activity.status.toLowerCase().indexOf(searchText.toLowerCase())> -1)
    });
  }

}
