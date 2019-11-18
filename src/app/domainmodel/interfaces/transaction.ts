import { CustomerVO } from "../../valueobjects/customerVO";
import { UserVO } from "../../valueobjects/userVO";
import { action } from 'mobx';

export abstract class Transaction{
	id: string;
    customerName: CustomerVO;
	platenumber: string;
	amount: number;
	transactionType: string;	
	createdBy: UserVO;
	datecreated: Date;

	abstract getIntValueOfAllocatedTime(time: string): number;

	abstract getSecondsBetweenDates(transactionCreationDate: Date);

	abstract startTimer();
}