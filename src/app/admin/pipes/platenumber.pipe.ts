import { Pipe, PipeTransform } from '@angular/core';
import { TellerTransactionActivity } from 'src/app/services/admin/displaymodels/telleractivitybreakdown';

@Pipe({
  name: 'platenumber'
})
export class PlatenumberPipe implements PipeTransform {

  transform(transactionActivity: TellerTransactionActivity[], searchText: any): any {
    if(searchText == null)
        return transactionActivity;
    
    return transactionActivity.filter(function(activity){
        return (activity.platenumber.toLowerCase().indexOf(searchText.toLowerCase())> -1)
    });
  }

}
