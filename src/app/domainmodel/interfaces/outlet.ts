import { AddressVO } from "../../valueobjects/addressVO";
import { UserVO } from "../../valueobjects/userVO";

export abstract class Outlet{
    name: string;
    address: AddressVO;
    createdBy: UserVO;
    datecreated: Date;
}