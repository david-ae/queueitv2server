import { Accounts } from '../../valueobjects/accountvo';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { CustomerVO } from 'src/app/valueobjects/customerVO';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from 'src/app/domainmodel/interfaces/transaction';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { UserVO } from 'src/app/valueobjects/userVO';
import { OutletImp } from 'src/app/domainmodel/outletimp';
import { TransactionApiModel } from '../apimodels/transactionapimodel';
import { OperationsService } from '../services/operations.service';
import { TransactionType } from 'src/app/domainmodel/transactiontype';
import { TransactionTypeFacade } from 'src/app/services/admin/transactiontypefacade';
import { Configuration } from 'src/app/config';
import { NgxSpinnerService } from 'ngx-spinner';
import { OperationsFacade } from 'src/app/services/operations/operationsfacade';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/_services';
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
  selector: 'app-job',
  templateUrl: './job.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  radioSel:any;
  radioSelected:string;
  radioSelectedString:string;
  itemsList: Item[] = ITEMS;

  transactionForm: FormGroup;
  buttonName: string = "Add Transaction";

  private _hubConnection: HubConnection;

  p: number = 1;
  collection: any[] = this.operationsFacade.transactions;
  
  constructor(private _transactionService: TransactionService, private _operationsService: OperationsService,
    public transactionTypeFacade: TransactionTypeFacade, private _configuration: Configuration, 
    public operationsFacade: OperationsFacade, public alertService: AlertService,
    private spinner: NgxSpinnerService, private userAccess: UserAccess) { 
    this.transactionForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      transactiontype: new FormControl('', Validators.required),
      registrationnumber: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      tellerid: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required)
    });
    this.itemsList = ITEMS;
      // this.radioSelected = "item_3";
      this.getSelecteditem();
  }  

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
    //invoke signalr
      this._operationsService.getTodaysTransactions()
    .subscribe(() => {
      this.spinner.hide();
    });
      //start streaming/listening for data via signalr
    this.startSignalRConnection();
  }

  getSelecteditem(){
    this.radioSel = ITEMS.find(Item => Item.value === this.radioSelected);
    this.radioSelectedString = JSON.stringify(this.radioSel);
  }

  onItemChange(item){
    this.getSelecteditem();
  }

  addTransaction(){
    this.spinner.show();
    let transaction = new TransactionApiModel();
    let firstname = this.transactionForm.get("firstname").value;
    let lastname = this.transactionForm.get("lastname").value;

    let agent = new CustomerVO();
    agent.firstname = firstname;
    agent.lastname = lastname;

    transaction.customerName = agent;
    transaction.platenumber = this.transactionForm.get("registrationnumber").value;
    transaction.status = this.transactionForm.get("status").value;
    transaction.transactionType = this.transactionForm.get("transactiontype").value;
    transaction.amount = this.transactionForm.get("amount").value;
    transaction.createdBy = this.userAccess.user;
    transaction.treatedBy = this.transactionForm.get("tellerid").value;
    transaction.timeSubmitted = new Date();
    transaction.outletName = "Courteville";
    transaction.allocatedTime = "10";

    this._transactionService.addTransaction(transaction)
      .subscribe (() =>{
        this.spinner.hide();
      this.transactionForm.reset({tellerid: 0, transactiontype: 0});      
      // this.alertService.success("New Transaction Added.");
    },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
          console.log("Error: " + err);
          this.alertService.error("Unable to Add New Transaction. Please try again.")
      }
    );    
  }

  editTransaction(id: string){    
    this.operationsFacade.transaction = this.operationsFacade.getTransaction(id);
    
    this.transactionForm.setValue({
      firstname: this.operationsFacade.transaction.customerName.firstname,
      lastname: this.operationsFacade.transaction.customerName.lastname,
      transactiontype: this.operationsFacade.transaction.transactionType,
      registrationnumber: this.operationsFacade.transaction.platenumber,
      amount: this.operationsFacade.transaction.amount,
      tellerid: this.operationsFacade.transaction.treatedBy[0].identity,
      status: this.operationsFacade.transaction.status
    });
    this.operationsFacade.transaction.treatedBy = [];
    this.operationsFacade.transaction.completedBy = null;
    this.operationsFacade.transaction.returnedBy = null;
    this.buttonName = "Update Transaction";
  }

  updateTransaction(){
    this.spinner.show();
    let firstname = this.transactionForm.get("firstname").value;
    let lastname = this.transactionForm.get("lastname").value;

    let agent = new CustomerVO();
    agent.firstname = firstname;
    agent.lastname = lastname;

    this.operationsFacade.transaction.customerName = agent;
    this.operationsFacade.transaction.platenumber = this.transactionForm.get("registrationnumber").value;
    this.operationsFacade.transaction.status = this.transactionForm.get("status").value;
    this.operationsFacade.transaction.transactionType = this.transactionForm.get("transactiontype").value;
    this.operationsFacade.transaction.amount = this.transactionForm.get("amount").value;

    let tellerid: string = this.transactionForm.get("tellerid").value;
    let teller = this.operationsFacade.getTellerById(tellerid);
    this.operationsFacade.transaction.treatedBy.push(teller); 
    this._transactionService.updateTransaction(this.operationsFacade.transaction)
        .subscribe(() => {
          this.spinner.hide();
          this.transactionForm.reset({tellerid: 0, transactiontype: 0});          
          this.alertService.success("Transaction Updated.");
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
            console.log("Error: " + err);
            this.alertService.error("Transaction Update Failed. Please try again")
        }
      );
      this.buttonName = "Add Transaction";
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

}
