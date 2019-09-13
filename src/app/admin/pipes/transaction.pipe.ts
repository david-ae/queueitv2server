import { Pipe, PipeTransform } from '@angular/core';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';

@Pipe({
  name: 'transaction'
})
export class TransactionPipe implements PipeTransform {
  transform(transactions: QueueITTransaction[], searchText: any): any {
    if(searchText == null)
        return transactions;

    return transactions.filter(function(transaction){
      return (transaction.customerName.firstname.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
      || (transaction.customerName.lastname.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
      || (transaction.platenumber.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
      || (transaction.amount.toString().indexOf(searchText.toString()) > -1);      
    });
  }
}
