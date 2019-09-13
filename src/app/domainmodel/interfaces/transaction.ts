import { CustomerVO } from "../../valueobjects/customerVO";
import { UserVO } from "../../valueobjects/userVO";

export abstract class Transaction{
	id: string;
    customerName: CustomerVO;
	platenumber: string;
	amount: number;
	transactionType: string;	
	createdBy: UserVO;
	datecreated: Date;
}