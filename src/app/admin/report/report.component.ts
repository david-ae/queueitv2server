import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateRangeApiModel } from '../apimodels/daterangeapimodel';
import { GeneralService } from '../services/general.service';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { ReportFacade } from 'src/app/services/admin/reportsfacade';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  reportForm: FormGroup;
  displayDateFrom: any;
  displayDateTo: any;
  search: boolean;

  p: number = 1;
  collection: any[] = this.reportFacade.transactionsInRange;

  constructor(private _generalService: GeneralService, public reportFacade: ReportFacade,
    private spinner: NgxSpinnerService) { 
    this.reportForm = new FormGroup({
      dateFrom: new FormControl('', Validators.required),
      dateTo: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.reportFacade.clearTransactionsInRange();
  }

  retrieveReportInRange(){    
    this.spinner.show();
    this.search = false;
    let dateRange = new DateRangeApiModel();
    let dateFrom: string = this.reportForm.get("dateFrom").value;
    let dateTo: string = this.reportForm.get("dateTo").value;

    dateRange.dateFrom = dateFrom;
    dateRange.dateTo = dateTo;
    this.displayDateFrom = dateFrom;
    this.displayDateTo = dateTo;

    this._generalService.getTransactionsInDateRange(dateRange)
        .subscribe((data: QueueITTransaction[]) => {
            this.spinner.hide();
            this.search = true;
            this.reportFacade.transactionsInRange = data;
            this.reportFacade.sortSummaryOfCompletedTransactions(this.reportFacade.transactionsInRange);
            this.reportFacade.sortSummaryOfSubmittedTransactions(this.reportFacade.transactionsInRange);
            this.reportFacade.sortSummaryOfReturnedTransactions(this.reportFacade.transactionsInRange);     
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          console.log("Error: " + err);
        }
        );
    this.reportFacade.transactionsInRange = [];    
  }
}
