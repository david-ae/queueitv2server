import { Injectable } from '@angular/core';
import { observable, action, computed } from 'mobx';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';

@Injectable()
export class TransactionStore{
    @observable transactions: QueueITTransaction[] = [];
    @observable transaction: QueueITTransaction = new QueueITTransaction();
    @observable tellerTransactions: QueueITTransaction[] = [];
    
    constructor(){}

    @computed get getTransactionList(){
        return this.transactions;
    }

    @action getTransaction(id: string){
        var transaction  = this.transactions.find( t => t.id == id);
        if(transaction != null){
            console.log(transaction);
            return transaction;
        }
        return null;
    }

    @action updateTransaction(transaction: QueueITTransaction){
        this.transactions.forEach(element => {
            if(element.id == transaction.id){
                element.amount = transaction.amount;
                element.platenumber = transaction.platenumber;
                element.status = transaction.status;
                element.transactionType = transaction.transactionType;
                element.rejectedBy = transaction.rejectedBy;
                element.completedBy = transaction.completedBy;
                element.flaggedIssueBy = transaction.flaggedIssueBy;
                element.returnedBy = transaction.returnedBy;
                element.timeCompleted = transaction.timeCompleted;
                element.timeIssueFlagged = transaction.timeIssueFlagged;
                element.timeRejected = transaction.timeRejected;
                element.treatedBy = transaction.treatedBy;
                element.customerName = transaction.customerName;
            }
        });
    }
    
    @computed get getTellerTransactions(){
        return this.tellerTransactions;
    }    

    @action assignedTransactions(id: string, transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.tellerTransactions = [];
        transactions.forEach(transaction => {
            transaction.treatedBy.forEach(teller => {
                if(teller.identity == id){
                    this.tellerTransactions.push(transaction);
                }
            })            
        });

        return this.tellerTransactions;
    }
}