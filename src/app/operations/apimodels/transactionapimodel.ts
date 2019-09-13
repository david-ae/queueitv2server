import { CustomerVO } from 'src/app/valueobjects/customerVO';
import { UserVO } from 'src/app/valueobjects/userVO';

export class TransactionApiModel{
    customerName: CustomerVO;
	platenumber: string;
	amount: number;
	transactionType: string;	
	createdBy: UserVO;
	datecreated: Date;
    timeSubmitted: Date;
    timeIssueFlagged: Date;
	timeCompleted: Date;
	timeRejected: Date;
	allocatedTime: string;
    flaggedIssueBy: string;
	rejectedBy: string;
	completedBy: string;
	returnedBy: string;
	treatedBy: string;
	status: string;
	outletName: string;
}