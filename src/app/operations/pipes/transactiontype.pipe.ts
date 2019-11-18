import { Pipe, PipeTransform } from '@angular/core';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';

@Pipe({
  name: 'transactiontype'
})
export class TransactiontypePipe implements PipeTransform {

  transform(transactions: QueueITTransaction[], searchText: any): any {
    if(searchText == null)
        return transactions;

    return transactions.filter(function(transaction){
      return (transaction.transactionType.toLowerCase().indexOf(searchText.toLowerCase()) > -1);      
    });
  }

}
