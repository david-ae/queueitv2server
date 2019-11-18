import { observable, computed, action } from 'mobx';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { Injectable } from '@angular/core';
import { UserVO } from 'src/app/valueobjects/userVO';
import { TellerTransactionActivity } from './displaymodels/telleractivitybreakdown';
import { TellerReportSystem } from './storehelpers/tellerreportsystem';
import { TellerReportSummary } from './displaymodels/tellerReportSummary';

@Injectable()
export class ReportFacade{

    //#region "containers for data"
    @observable transactionsInRange: QueueITTransaction[];
    //for dashboard figures and count
    @observable submittedTransactions: QueueITTransaction[];
    @observable processingTransactions: QueueITTransaction[];
    @observable awaitingMailTransactions: QueueITTransaction[];
    @observable rejectedTransactions: QueueITTransaction[];
    @observable completedTransactions: QueueITTransaction[];
    @observable returnedTransactions: QueueITTransaction[];

    //for report summary
    @observable summarySubmittedTransactions: QueueITTransaction[];
    @observable summaryCompletedTransactions: QueueITTransaction[];
    @observable tellerReportSummaries: TellerReportSummary[];
    @observable summaryReturnedTransactions: QueueITTransaction[];
    //#endregion

    //#region "teller report system"
    @observable reportSystem: TellerReportSystem;
    @observable transactionStatus: string;
    @observable totalAmountReceived: number;

    @observable submittedTransactionsBreakdownList: TellerTransactionActivity[];
    @observable processingTransactionsBreakdownList: TellerTransactionActivity[];
    @observable completedTransactionsBreakdownList: TellerTransactionActivity[];
    @observable returnedTransactionsBreakdownList: TellerTransactionActivity[];
    @observable rejectedTransactionsBreakdownList: TellerTransactionActivity[];
    @observable awaitingMailTransactionsBreakdownList: TellerTransactionActivity[];
    @observable issueTransactionsBreakdownList: TellerTransactionActivity[];
    @observable transactionsBreakdownList: TellerTransactionActivity[];
    //#endregion

    constructor(){
        this.transactionsInRange = [];
        this.submittedTransactions = [];
        this.processingTransactions = [];
        this.awaitingMailTransactions = [];
        this.rejectedTransactions = [];
        this.completedTransactions = [];
        this.returnedTransactions = [];
        this.summaryCompletedTransactions = [];
        this.summaryReturnedTransactions = [];
        this.summarySubmittedTransactions = [];
        this.tellerReportSummaries = [];
        this.submittedTransactionsBreakdownList = [];
        this.processingTransactionsBreakdownList = [];
        this.awaitingMailTransactionsBreakdownList = [];
        this.issueTransactionsBreakdownList = [];
        this.transactionsBreakdownList = [];    
        this.totalAmountReceived = 0;    
    }
    //#region Today Dashboard Snapshot Setup

    @computed get getTransactionsInRange(){
        return this.transactionsInRange;
    }

    @computed get getSumOfTransactionsInRange(){
        var sumOfTransactions = 0;
        this.transactionsInRange.forEach(transaction => {
            if(transaction.status == "Returned"){
                sumOfTransactions += transaction.amount;
            }            
        });
        return sumOfTransactions;
    }

    @action clearTransactionsInRange(){
        this.transactionsInRange = [];
    }
    
    @action sortSubmittedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.submittedTransactions = transactions.filter(t => t.status == "Submitted");
        return this.submittedTransactions;
    }

    @computed get getSubmittedTransactions(){
        return this.submittedTransactions.length;
    }

    @action sortSummaryOfSubmittedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.summarySubmittedTransactions = transactions.filter(t => t.status == "Submitted");
        return this.summarySubmittedTransactions;
    }

    @computed get getSummaryOfSubmittedTransactions(){
        return this.summarySubmittedTransactions.length;
    }

    @action sortTransactionsBeingProcessed(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.processingTransactions = transactions.filter(t => t.status == "Processing");
        return this.processingTransactions;
    }
    
    @computed get getTransactionsBeingProcessed(){
        return this.processingTransactions.length;
    }

    @action sortTransactionsAwaitingMail(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.awaitingMailTransactions = transactions.filter(t => t.status == "Awaiting-Mail");
        return this.awaitingMailTransactions;
    }
    
    @computed get getTransactionsAwaitingMail(){
        return this.awaitingMailTransactions.length;
    }

    @action sortRejectedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.rejectedTransactions = transactions.filter(t => t.status == "Rejected");
        return this.rejectedTransactions;
    }
    
    @computed get getRejectedTransactions(){
        return this.rejectedTransactions.length;
    }

    @action sortCompletedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.completedTransactions = transactions.filter(t => t.status == "Completed");
        return this.completedTransactions;
    }
    
    @computed get getCompletedTransactions(){
        return this.completedTransactions.length;
    }

    @action sortSummaryOfCompletedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.summaryCompletedTransactions = transactions.filter(t => t.status == "Completed");
        return this.summaryCompletedTransactions;
    }
    
    @computed get getSummaryOfCompletedTransactions(){
        return this.summaryCompletedTransactions.length;
    }

    @action sortReturnedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.returnedTransactions = transactions.filter(t => t.status == "Returned");
        return this.returnedTransactions;
    }
    
    @computed get getReturnedTransactions(){
        return this.returnedTransactions.length;
    }

    @computed get getTotalAmountReceived(){
        return this.totalAmountReceived;
    }

    @action sortTotalAmountReceived(transactions: QueueITTransaction[]): number{

        this.totalAmountReceived = transactions.map(transaction => transaction.amount).reduce((a, c) => {
            return a + c
        }, 0);
        return this.totalAmountReceived;
    }

    @action sortSummaryOfReturnedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.summaryReturnedTransactions = transactions.filter(t => t.status == "Returned");
        return this.summaryReturnedTransactions;
    }
    
    @computed get getSummaryOfReturnedTransactions(){
        return this.summaryReturnedTransactions.length;
    }

    //#endregion

    //#region Teller Transaction Activity Breakdown    
    @computed get submittedTransactionActivity(){
        return this.submittedTransactionsBreakdownList;
    }

    @computed get transactionActivity(){
        return this.transactionsBreakdownList;
    }

    @action prepareSubmittedTransactionActivity(transactions: QueueITTransaction[]){
        // this.transactionsBreakdownList = [];
        transactions.forEach(transaction => {
            if(transaction.status.toUpperCase() == "SUBMITTED"){
                let activity = new TellerTransactionActivity();
                activity.tellerFullName = transaction.createdBy.firstname + " " + transaction.createdBy.lastname;
                activity.platenumber = transaction.platenumber;
                activity.count++;
                activity.timeCompleted = transaction.timeCompleted;
                activity.timeSubmitted = transaction.timeSubmitted;
                activity.transactionType = transaction.transactionType;
                activity.status = transaction.status;
                activity.amountProcessed = transaction.amount;
                this.transactionsBreakdownList.push(activity);
            }
        });
    }

    @computed get getTellerTransactionSummaries(){
        return this.tellerReportSummaries;
    }

    @computed get getTellerTransactionSummariesTotal(){
        let total = this.tellerReportSummaries.map(summary => summary.amountProcessed).reduce((a, c) =>{
            return a + c
        });
        return total;
    }

    @action prepareTellerTransactionSummaries(transactions: QueueITTransaction[]){
        transactions.forEach(transaction => {
            //if there are no report yet, create one
            if(this.tellerReportSummaries.length == 0){
                //if the transaction has ever been completed, create the teller report summary
                if(transaction.timeCompleted !== null){
                    let tellerReport = new TellerReportSummary();
                    tellerReport.tellerId = transaction.createdBy.identity;
                    tellerReport.count++;
                    tellerReport.tellerName = transaction.createdBy.firstname 
                                        + " " + transaction.createdBy.lastname;
                    tellerReport.amountProcessed += transaction.amount;
                    this.tellerReportSummaries.push(tellerReport);
                }
            }
            else if(this.tellerReportSummaries.length > 0){
                let result = this.checkIfTellerExists(transaction.createdBy.identity, this.tellerReportSummaries);

                if(result){
                    this.tellerReportSummaries.forEach(tellerSummary => {
                        tellerSummary.amountProcessed += transaction.amount;
                        tellerSummary.count++;
                    });
                }
            }
        });
    }

    checkIfTellerExists(tellerId:  string, tellerSummaries: TellerReportSummary[]){
        let teller = tellerSummaries.find(s => s.tellerId == tellerId);
        if(teller != null){
            return true;
        }

        return false;
    }

    @computed get processingTransactionActivity(){
        return this.processingTransactionsBreakdownList;
    }

    @action prepareProcessingTransactionActivity(transactions: QueueITTransaction[]){
        // this.transactionsBreakdownList = [];
        transactions.forEach(transaction => {
            if(transaction.status.toUpperCase() == "PROCESSING"){                
                transaction.treatedBy.forEach(teller => {
                    teller.roles.forEach(role => {
                        if(role == "SENIOR TELLER"){
                            let activity = new TellerTransactionActivity();
                            activity.tellerFullName = teller.firstname + " " + teller.lastname;
                            activity.count++;
                            activity.timeCompleted = transaction.timeCompleted;
                            activity.timeSubmitted = transaction.timeSubmitted;
                            activity.platenumber = transaction.platenumber;
                            activity.transactionType = transaction.transactionType;
                            activity.status = transaction.status;
                            activity.amountProcessed += transaction.amount;
                            this.transactionsBreakdownList.push(activity);
                        }
                    });
                });                
            }
        });
    }

    @computed get completedTransactionActivity(){
        return this.completedTransactionsBreakdownList;
    }

    @action prepareCompletedTransactionActivity(transactions: QueueITTransaction[]){
        // this.transactionsBreakdownList = [];
        transactions.forEach(transaction => {
            if(transaction.status.toUpperCase() == "COMPLETED"){                
                transaction.treatedBy.forEach(teller => {
                    teller.roles.forEach(role => {
                        if(role == "SENIOR TELLER"){
                            let activity = new TellerTransactionActivity();
                            activity.tellerFullName = teller.firstname + " " + teller.lastname;
                            activity.count++;
                            activity.timeCompleted = transaction.timeCompleted;
                            activity.timeSubmitted = transaction.timeSubmitted;
                            activity.platenumber = transaction.platenumber;
                            activity.transactionType = transaction.transactionType;
                            activity.status = transaction.status;
                            activity.amountProcessed += transaction.amount;
                            this.transactionsBreakdownList.push(activity);
                        }
                    });
                });                
            }
        });
    }

    @computed get returnedTransactionActivity(){
        return this.returnedTransactionsBreakdownList;
    }

    @action prepareReturnedTransactionActivity(transactions: QueueITTransaction[]){
        // this.transactionsBreakdownList = [];
        transactions.forEach(transaction => {
            if(transaction.status.toUpperCase() == "RETURNED"){                
                transaction.treatedBy.forEach(teller => {
                    teller.roles.forEach(role => {
                        if(role == "SENIOR TELLER"){
                            let activity = new TellerTransactionActivity();
                            activity.tellerFullName = teller.firstname + " " + teller.lastname;
                            activity.count++;
                            activity.timeCompleted = transaction.timeCompleted;
                            activity.timeSubmitted = transaction.timeSubmitted;
                            activity.platenumber = transaction.platenumber;
                            activity.transactionType = transaction.transactionType;
                            activity.status = transaction.status;
                            activity.amountProcessed += transaction.amount;
                            this.transactionsBreakdownList.push(activity);
                        }
                    });
                });                
            }
        });
    }

    @computed get rejectedTransactionActivity(){
        return this.rejectedTransactionsBreakdownList;
    }

    @action prepareRejectedTransactionActivity(transactions: QueueITTransaction[]){
        // this.transactionsBreakdownList = [];
        transactions.forEach(transaction => {
            if(transaction.status.toUpperCase() == "REJECTED"){                
                transaction.treatedBy.forEach(teller => {
                    teller.roles.forEach(role => {
                        if(role == "SENIOR TELLER" || role == "TRANSACTIONAL TELLER" || role == "TELLER"){
                            let activity = new TellerTransactionActivity();
                            activity.tellerFullName = teller.firstname + " " + teller.lastname;
                            activity.count++;
                            activity.timeCompleted = transaction.timeCompleted;
                            activity.timeSubmitted = transaction.timeSubmitted;
                            activity.platenumber = transaction.platenumber;
                            activity.transactionType = transaction.transactionType;
                            activity.status = transaction.status;
                            activity.amountProcessed += transaction.amount;
                            this.transactionsBreakdownList.push(activity);
                        }
                    });
                });                
            }
        });
    }

    @computed get awaitingMailTransactionActivity(){
        return this.awaitingMailTransactionsBreakdownList;
    }

    @action prepareAwaitingMailTransactionActivity(transactions: QueueITTransaction[]){        //this.transactionsBreakdownList = [];
        // this.transactionsBreakdownList = [];
        transactions.forEach(transaction => {
            if(transaction.status.toUpperCase() == "AWAITING-MAIL"){                
                transaction.treatedBy.forEach(teller => {
                    teller.roles.forEach(role => {
                        if(role == "SENIOR TELLER"){
                            let activity = new TellerTransactionActivity();
                            activity.tellerFullName = teller.firstname + " " + teller.lastname;
                            activity.count++;
                            activity.timeCompleted = transaction.timeCompleted;
                            activity.timeSubmitted = transaction.timeSubmitted;
                            activity.platenumber = transaction.platenumber;
                            activity.transactionType = transaction.transactionType;
                            activity.status = transaction.status;
                            activity.amountProcessed += transaction.amount;
                            this.transactionsBreakdownList.push(activity);
                        }
                    });
                });                
            }
        });
    }

    @computed get issueTransactionActivity(){
        return this.issueTransactionsBreakdownList;
    }

    @action prepareIssueTransactionActivity(transactions: QueueITTransaction[]){        //this.transactionsBreakdownList = [];
        // this.transactionsBreakdownList = [];
        transactions.forEach(transaction => {
            if(transaction.status.toUpperCase() == "ISSUE"){                
                transaction.treatedBy.forEach(teller => {
                    teller.roles.forEach(role => {
                        if(role == "SENIOR TELLER"){
                            let activity = new TellerTransactionActivity();
                            activity.tellerFullName = teller.firstname + " " + teller.lastname;
                            activity.count++;
                            activity.timeCompleted = transaction.timeCompleted;
                            activity.timeSubmitted = transaction.timeSubmitted;
                            activity.platenumber = transaction.platenumber;
                            activity.transactionType = transaction.transactionType;
                            activity.status = transaction.status;
                            activity.amountProcessed += transaction.amount;
                            this.transactionsBreakdownList.push(activity);
                        }
                    });
                });                
            }
        });
    }

    checkIfUserExists(tellerId:  string, breakdownList: TellerTransactionActivity[]){
        let user = breakdownList.filter(b => b.tellerId == tellerId);
        if(user != null){
            return true;
        }

        return false;
    }
    //#endregion
}