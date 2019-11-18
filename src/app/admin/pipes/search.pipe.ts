import { Pipe, PipeTransform } from '@angular/core';
import { TellerTransactionActivity } from 'src/app/services/admin/displaymodels/telleractivitybreakdown';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(transactionActivity: TellerTransactionActivity[], searchText: any): any {
    if(searchText == null)
        return transactionActivity;
    
    return transactionActivity.filter(function(activity){
        return (activity.status.toLowerCase().indexOf(searchText.toLowerCase())> -1
        || activity.platenumber.toLowerCase().indexOf(searchText.toLowerCase())> -1
        || activity.tellerFullName.toLowerCase().indexOf(searchText.toLowerCase())> -1
        || activity.transactionType.toLowerCase().indexOf(searchText.toLowerCase())> -1)
    });
  }

}
