import { Pipe, PipeTransform } from '@angular/core';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';

@Pipe({
  name: 'tellertransaction'
})
export class TellertransactionPipe implements PipeTransform {

  transform(transactions: QueueITTransaction[], searchText: any): any {
    if(searchText == null)
        return transactions;

    return transactions.filter(function(transaction){
      return transaction.treatedBy.filter(function(teller){
        return (teller.firstname.toLowerCase().indexOf(searchText.toLowerCase())> -1)
        || (teller.lastname.toLowerCase().indexOf(searchText.toLowerCase())> -1)
      })      
    });
  }

}
