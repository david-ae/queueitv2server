import { Transaction } from "./interfaces/transaction";
import { UserVO } from "../valueobjects/userVO";
import { Outlet } from "./interfaces/outlet";
import { action, computed } from 'mobx';

export class QueueITTransaction extends Transaction{
    timeSubmitted: Date;
    timeIssueFlagged: Date;
	timeCompleted: Date;
	timeRejected: Date[];
	allocatedTime: string;
    flaggedIssueBy: UserVO[];
	rejectedBy: UserVO[];
	completedBy: UserVO;
	returnedBy: UserVO[];
	treatedBy: UserVO[];
	status: string;
	timer: number;

	constructor(){
		super();
		this.timeRejected = [];
		this.flaggedIssueBy = [];
		this.rejectedBy = [];
		this.treatedBy = [];
		this.returnedBy = [];
	}

	startTimer() {
		let time: number = 0;
		let interval;
		interval = setInterval(() => {
			
		},1000)
	}

	getIntValueOfAllocatedTime(): number{
		return parseInt(this.allocatedTime);
	}

	getSecondsBetweenDates(transactionCreationDate: Date): number{		
		let secondsBetweenDates = Math.abs((new Date().getTime() - transactionCreationDate.getTime())/1000);		
		this.allocatedTime = secondsBetweenDates.toString();
		return secondsBetweenDates;
	}
}