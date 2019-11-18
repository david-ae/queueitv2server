import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Configuration } from 'src/app/config';
import { OperationsFacade } from 'src/app/services/operations/operationsfacade';
import { ReportFacade } from 'src/app/services/admin/reportsfacade';
import { UserVO } from 'src/app/valueobjects/userVO';
import { GeneralService } from '../services/general.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DateRangeApiModel } from '../apimodels/daterangeapimodel';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { NgxSpinnerService } from 'ngx-spinner';
import { OperationsService } from 'src/app/operations/services/operations.service';
import { TransactionTypeFacade } from 'src/app/services/admin/transactiontypefacade';
import { UserAccess } from './../../services/authentication/usersAccess';

export class Item{
  name:string;
  value:string;
}

export const ITEMS: Item[] = [
  {
      name:'Submitted',
      value:'Submitted'
   },
   {
       name:'Processing',
       value:'Processing'
    },
    {
      name:'Awaiting Mail',
      value:'Awaiting-Mail'
   }
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  radioSel:any;
  radioSelected:string;
  radioSelectedString:string;
  itemsList: Item[] = ITEMS;
  statusForm: FormGroup;
  val: false;

  transactionStatus: string;
  quickViewForm: FormGroup;
  search: boolean = false;  

  p: number = 1;
  collection: any[] = this.reportFacade.transactionsBreakdownList;

  private _hubConnection: HubConnection;
  constructor(private _configuration: Configuration, public operationsFacade: OperationsFacade,
    public reportFacade: ReportFacade, private _generalService: GeneralService, private _operationsService: OperationsService,
    public spinner: NgxSpinnerService, public transactionTypeFacade: TransactionTypeFacade, private userAccess: UserAccess) { 
      this.quickViewForm = new FormGroup({
        dateTo: new FormControl('')
      });
      this.statusForm = new FormGroup({
        status: new FormControl('')
      });
      this.itemsList = ITEMS;
      // this.radioSelected = "item_3";
      this.getSelecteditem();
  }

  getSelecteditem(){
    this.radioSel = ITEMS.find(Item => Item.value === this.radioSelected);
    this.radioSelectedString = JSON.stringify(this.radioSel);
  }

  onItemChange(item){
    this.getSelecteditem();
  }

  getTimeDifference(timeSubmitted: Date, timeCompleted: Date): number{  
    let timeOne = (new Date(timeSubmitted).getTime()) / 1000;
    let timeTwo = (new Date(timeCompleted).getTime()) / 1000;
    let difference = timeTwo - timeOne;
    return parseInt(difference.toString());
   }

  startSignalRConnection(){
    let builder = new HubConnectionBuilder();
    // this._hubConnection = builder.withUrl(this._configuration.ApiServerSSL + 'transactions', 
    // { accessTokenFactory: () => localStorage.getItem('id_token') }).build();
    this._hubConnection = builder.withUrl(this._configuration.ApiServerSSL + 'transactions').build();

    this._hubConnection.on('GetTodayTransactions', data => {
      this.operationsFacade.transactions = data;
      this.reportFacade.sortCompletedTransactions(this.operationsFacade.transactions);
      this.reportFacade.sortRejectedTransactions(this.operationsFacade.transactions);
      this.reportFacade.sortTransactionsAwaitingMail(this.operationsFacade.transactions);
      this.reportFacade.sortTransactionsBeingProcessed(this.operationsFacade.transactions);
      this.reportFacade.sortSubmittedTransactions(this.operationsFacade.transactions);
      this.reportFacade.sortReturnedTransactions(this.operationsFacade.transactions);   
      this.reportFacade.sortTotalAmountReceived(this.reportFacade.returnedTransactions);

      //clear transaction activity board
      this.reportFacade.transactionsBreakdownList = [];
      this.reportFacade.prepareSubmittedTransactionActivity(this.operationsFacade.transactions);
      this.reportFacade.prepareProcessingTransactionActivity(this.operationsFacade.transactions);
      this.reportFacade.prepareCompletedTransactionActivity(this.operationsFacade.transactions);
      this.reportFacade.prepareRejectedTransactionActivity(this.operationsFacade.transactions);
      this.reportFacade.prepareReturnedTransactionActivity(this.operationsFacade.transactions);
      this.reportFacade.prepareAwaitingMailTransactionActivity(this.operationsFacade.transactions);
      this.reportFacade.prepareIssueTransactionActivity(this.operationsFacade.transactions);

      this.reportFacade.tellerReportSummaries = [];
      this.reportFacade.prepareTellerTransactionSummaries(this.operationsFacade.transactions);

    });

    this._hubConnection.start().then(() => console.log("connected"));
  }

  ngOnInit() {        
    this.startSignalRConnection();
    this.reportFacade.prepareSubmittedTransactionActivity(this.operationsFacade.transactions);
    this.transactionStatus = "Submitted";
    this._operationsService.getTodaysTransactions(this.userAccess.user.identity.toString())
    .subscribe((data: QueueITTransaction[]) => {
      
    });
  }

  tellerSubmittedTransaction(){
    this.reportFacade.prepareSubmittedTransactionActivity(this.operationsFacade.transactions);
    this.transactionStatus = "Submitted";
  }

  tellerProcessingTransactions(){
    this.reportFacade.prepareProcessingTransactionActivity(this.operationsFacade.transactions);
    this.transactionStatus = "Processing";
  }

  tellerAwaitingMailTransactions(){
    this.reportFacade.prepareAwaitingMailTransactionActivity(this.operationsFacade.transactions);
    this.transactionStatus = "Awaiting Mail";
  }

  retrieveAnalysis(){
    this.spinner.show();
    let dateRange = new DateRangeApiModel();
    let dateTo: string = this.quickViewForm.get("dateTo").value;

    dateRange.dateFrom = dateTo;
    dateRange.dateTo = dateTo;

    this._generalService.getTransactionsInDateRange(dateRange)
        .subscribe((data: QueueITTransaction[]) => {
          if(data){
            this.spinner.hide();
            this.search = true;
            this.reportFacade.transactionsInRange = data;
            this.reportFacade.sortCompletedTransactions(this.reportFacade.transactionsInRange);
            this.reportFacade.sortSubmittedTransactions(this.reportFacade.transactionsInRange);
            this.reportFacade.sortReturnedTransactions(this.reportFacade.transactionsInRange);
            
            return;
          }         
        });
  }
}
