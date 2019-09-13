import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Configuration } from 'src/app/config';
import { OperationsService } from '../services/operations.service';
import { UserVO } from 'src/app/valueobjects/userVO';
import { TransactionService } from '../services/transaction.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from 'src/app/admin/services/general.service';
import { Status } from 'src/app/domainmodel/status';
import { StatusFacade } from 'src/app/services/admin/statusfacade';
import { HttpErrorResponse } from '@angular/common/http';
import { TransactionTypeFacade } from 'src/app/services/admin/transactiontypefacade';
import { TransactionType } from 'src/app/domainmodel/transactiontype';
import { OperationsFacade } from 'src/app/services/operations/operationsfacade';
import { AlertService } from 'src/app/shared/_services';
import { UserAccess } from 'src/app/services/authentication/usersAccess';

@Component({
  selector: 'app-collections',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  private _hubConnection: HubConnection;

  p: number = 1;
  collection: any[] = this.operationsFacade.transactions;

  constructor(public operationsFacade: OperationsFacade, private _configuration: Configuration,
    private _operationsService: OperationsService, private _transactionService: TransactionService,
    public statusFacade: StatusFacade, public transactionTypeFacade: TransactionTypeFacade, 
    private spinner: NgxSpinnerService, public alertService: AlertService,
    private userAccess: UserAccess) { }

  startSignalRConnection(){
    let builder = new HubConnectionBuilder();
    this._hubConnection = builder.withUrl(this._configuration.ApiServerSSL + 'transactions').build();

    this._hubConnection.on('GetTodayTransactions', data => {
      this.operationsFacade.transactions = data;
    });

    this._hubConnection.start().then(() => console.log("connected"));
  }

  ngOnInit() {
    this.spinner.show();
    this._operationsService.getTodaysTransactions()
    .subscribe(() => {
      this.spinner.hide();
    });
   this.startSignalRConnection();
  }

  completeTransaction(id: string){
    this.spinner.show();
    this.operationsFacade.transaction = this.operationsFacade.getTransaction(id);

    this.operationsFacade.transaction.status = "Completed";
    this.operationsFacade.transaction.completedBy = this.userAccess.user;
    this.operationsFacade.transaction.timeCompleted = new Date(); 
    this._transactionService.updateTransaction(this.operationsFacade.transaction)
        .subscribe(() => {
          this.spinner.hide();
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
            console.log("Error: " + err);
            this.alertService.error("Unable to Complete Transaction. Please try again.")
        }
      );
  }

  rejectTransaction(id: string){
    this.spinner.show();
    this.operationsFacade.transaction = this.operationsFacade.getTransaction(id);

    this.operationsFacade.transaction.status = "Rejected";
    this.operationsFacade.transaction.rejectedBy.push(this.userAccess.user);
    this.operationsFacade.transaction.timeRejected.push(new Date()); 
    this._transactionService.updateTransaction(this.operationsFacade.transaction)
        .subscribe(() => {
          this.spinner.hide();
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
            console.log("Error: " + err);
            this.alertService.error("Unable to Reject Transaction. Please try again.")
        }
      );
  }

  returnedTransaction(id: string){
    this.spinner.show();
    this.operationsFacade.transaction = this.operationsFacade.getTransaction(id);

    this.operationsFacade.transaction.status = "Returned";
    this.operationsFacade.transaction.returnedBy.push(this.userAccess.user);
    this._transactionService.updateTransaction(this.operationsFacade.transaction)
        .subscribe(() => {
          this.spinner.hide();
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
            console.log("Error: " + err);
            this.alertService.error("Unable to Complete Transaction. Please try again.")
        }
    );
  }
}
