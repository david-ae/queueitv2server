import { Component, OnInit, ChangeDetectionStrategy, Injectable } from '@angular/core';
import { OperationsService } from '../services/operations.service';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { observable, computed } from 'mobx';
import { Configuration } from 'src/app/config';
import { Accounts } from 'src/app/valueobjects/accountvo';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserVO } from 'src/app/valueobjects/userVO';
import { TransactionService } from '../services/transaction.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OperationsFacade } from 'src/app/services/operations/operationsfacade';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/shared/_services';
import { UserAccess } from 'src/app/services/authentication/usersAccess';

@Component({
  selector: 'app-processtransactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './processtransactions.component.html',
  styleUrls: ['./processtransactions.component.css']
})
export class ProcesstransactionsComponent implements OnInit {
  
  private _hubConnection: HubConnection;
  processTransactionForm: FormGroup;
  assignToColleagueForm: FormGroup;

  p: number = 1;
  collection: any[] = this.operationsFacade.tellerTransactions;
  
  constructor(private _operationsService: OperationsService, private _configuration: Configuration, 
    public operationsFacade: OperationsFacade, private _transactionService: TransactionService, 
    private spinner: NgxSpinnerService, public alertService: AlertService,
    private userAccess: UserAccess) { 
      this.processTransactionForm = new FormGroup({
        tellerid: new FormControl('', Validators.required)
      });
      this.assignToColleagueForm = new FormGroup({
        tellerid: new FormControl('', Validators.required)
      });
    }

  startSignalRConnection(){
    let builder = new HubConnectionBuilder();
    this._hubConnection = builder.withUrl(this._configuration.ApiServerSSL + 'transactions').build();    
    
    this._hubConnection.on('GetTodayTransactions', data => {      
      this.operationsFacade.transactions = data;
      this.operationsFacade.assignedTransactions(this.userAccess.user.identity, 
                  this.operationsFacade.transactions);
    });    

    this._hubConnection.start();
  }

  ngOnInit() {
    this.spinner.show();
    this._operationsService.getTodaysTransactions()
    .subscribe(() => {
      this.spinner.hide();
    },
    (err: HttpErrorResponse) => {
      this.spinner.hide();
        console.log("Error: " + err);
        this.alertService.error("Something went wrong. Please login again.")
    }
    );
    this.startSignalRConnection();
  }

  allocate(){
    this.spinner.show();
    let tellerid = this.assignToColleagueForm.get("tellerid").value;

    let teller = this.operationsFacade.getSeniorTellerById(tellerid);
    let result = this.operationsFacade.checkIfTellerExistAlready(this.operationsFacade.transaction, teller);
    if(!result){
      this.operationsFacade.transaction.treatedBy.push(teller);
    }
    
    this._transactionService.updateTransaction(this.operationsFacade.transaction)
        .subscribe(() => {
          this.spinner.hide();
          //this.alertService.success("Transaction allocated to " + teller.firstname + " " + teller.lastname);
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
            this.alertService.error("Unable to Assign Transaction to Colleague. Please try again.");
        }
        );
  }

  assignTransaction(transactionid: string){
    this.spinner.show();

    this.operationsFacade.transaction = this.operationsFacade.getTransaction(transactionid);

    let tellerid = this.processTransactionForm.get("tellerid").value;

    let teller = this.operationsFacade.getTellerById(tellerid);
    let result = this.operationsFacade.checkIfTellerExistAlready(this.operationsFacade.transaction, teller);

    if(!result){
      this.operationsFacade.transaction.treatedBy.push(teller);
    }    
    
    this.operationsFacade.transaction.status = "Processing";
    this._transactionService.updateTransaction(this.operationsFacade.transaction)
        .subscribe(() => {
          this.spinner.hide();
         // this.alertService.success("Transaction assigned to " + teller.firstname + " " + teller.lastname);
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
            this.alertService.error("Unable to Assign Transaction. Please try again.")
        }
      );
  }

  markTransactionHasIssue(id: string){
    this.spinner.show();
    this.operationsFacade.transaction = this.operationsFacade.getTransaction(id);

    this.operationsFacade.transaction.status = "Issue";
    this.operationsFacade.transaction.timeIssueFlagged = new Date();
    this.operationsFacade.transaction.flaggedIssueBy.push(this.userAccess.user);

    this._transactionService.updateTransaction(this.operationsFacade.transaction)
        .subscribe(()=> {
          this.spinner.hide();
         // this.alertService.success("Transaction flagged! ");
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
            console.log("Error: " + err);
            this.alertService.error("Unable to Flag Transaction. Please try again.")
        }
        );
  }

  rejectTransaction(id: string){
    this.spinner.show();
    this.operationsFacade.transaction = this.operationsFacade.getTransaction(id);

    this.operationsFacade.transaction.status = "Rejected";
    this.operationsFacade.transaction.timeRejected.push(new Date());
    this.operationsFacade.transaction.rejectedBy.push(this.userAccess.user);

    this._transactionService.updateTransaction(this.operationsFacade.transaction)
        .subscribe(()=> {
          this.spinner.hide();
         // this.alertService.success("Transaction rejected!");
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
            console.log("Error: " + err);
            this.alertService.error("Unable to Reject Transaction. Please try again.")
        }
    );
  }

  turnToUserVO(user: Accounts): UserVO{

    let _user = new UserVO();
    _user.firstname = user.firstname;
    _user.lastname = user.lastname;
    _user.identity = user.identity;
    _user.email = user.username;
    _user.roles = user.roles;

    return _user;
  }

  selectedTransaction(id: string){
    this.operationsFacade.transaction = this.operationsFacade.getTransaction(id);
  }
}
