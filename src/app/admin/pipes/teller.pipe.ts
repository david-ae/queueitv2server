import { Pipe, PipeTransform } from '@angular/core';
import { TellerReportSummary } from 'src/app/services/admin/displaymodels/tellerReportSummary';

@Pipe({
  name: 'teller'
})
export class TellerPipe implements PipeTransform {

  transform(tellerTransactionSummaries: TellerReportSummary[], searchText: any): any {
    if(searchText == null)
        return tellerTransactionSummaries;
    
    return tellerTransactionSummaries.filter(function(tellerTransactionSummary){
        return (tellerTransactionSummary.tellerName.toLowerCase().indexOf(searchText.toLowerCase())> -1)
    });
  }

}
