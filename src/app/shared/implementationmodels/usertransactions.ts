import { UserVO } from 'src/app/valueobjects/userVO';

export abstract class UserTransactions{
    tellerName: UserVO;
    noOfTransWorkedOn: number;
    totalAmount: number;
}