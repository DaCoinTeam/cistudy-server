import { Output } from "@common";
import { AccountMySqlEntity } from "@database";

export class SignUpOutputOthers {
    account : AccountMySqlEntity
}

export class SignUpOutput implements Output<SignUpOutputOthers>{
    message: string;
    others: SignUpOutputOthers;
}

export class VerifyRegistrationOutput implements Output {
    message: string;

}