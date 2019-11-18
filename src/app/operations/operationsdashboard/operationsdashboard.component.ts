import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Configuration } from 'src/app/config';
import { OperationsFacade } from 'src/app/services/operations/operationsfacade';
import { OperationsService } from '../services/operations.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { UserAccess } from './../../services/authentication/usersAccess';

export class TransactionTimer{
  id: string;
  timeInMinutes: number;
  timeInSeconds: number;
  timeToDisplay: number;
}

@Component({
  selector: 'app-operationsdashboard',
  templateUrl: './operationsdashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./operationsdashboard.component.css', './bootstrap.css']
})
export class OperationsdashboardComponent implements OnInit {

  private _hubConnection: HubConnection;
  transactionsWithTimer = [];
  timers:TransactionTimer[] = [];
  interval;
  constructor(private _configuration: Configuration, public operationsFacade: OperationsFacade,
    private _operationsService: OperationsService,private spinner: NgxSpinnerService,
    private userAccess: UserAccess) { }

  startSignalRConnection(){
    let builder = new HubConnectionBuilder();
    this._hubConnection = builder.withUrl(this._configuration.ApiServerSSL + 'transactions').build();

    this._hubConnection.on('GetTodayTransactions', data => {
      this.operationsFacade.transactions = data;
      this.operationsFacade.reformTransactions(this.operationsFacade.transactions);
      this.reformTransactions(this.operationsFacade.transactions);
    });
    this._hubConnection.start().then(() => console.log("connected"));
  }
 
  ngOnInit() {    
    this.spinner.show();
    //invoke signalr
      this._operationsService.getTodaysTransactions(this.userAccess.user.identity.toString())
    .subscribe(() => {
      this.spinner.hide();
    });
      //start streaming/listening for data via signalr
    this.startSignalRConnection();
   
  }

  getTimeDifference(timeSubmitted: Date, timeCompleted: Date): number{    
     let timeOne = (new Date(timeSubmitted).getTime()) / 1000;
     let timeTwo = (new Date(timeCompleted).getTime()) / 1000;
     let difference = timeTwo - timeOne;
     return parseInt(difference.toString());
  }

  reformTransactions(transactions: QueueITTransaction[]){
    transactions.forEach(transaction => {
      this.operationsFacade.getSecondsBetweenDates(transaction);
    });
  }
}
