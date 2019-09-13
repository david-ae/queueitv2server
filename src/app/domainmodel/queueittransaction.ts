import { Transaction } from "./interfaces/transaction";
import { UserVO } from "../valueobjects/userVO";
import { Outlet } from "./interfaces/outlet";

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
	outletName: string;

	constructor(){
		super();
		this.timeRejected = [];
		this.flaggedIssueBy = [];
		this.rejectedBy = [];
		this.treatedBy = [];
		this.returnedBy = [];
	}
}