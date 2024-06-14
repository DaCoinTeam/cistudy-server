import { AuthOutput, WsOutput } from "@common";
import { AccountMySqlEntity } from "@database";

export class TestOutputOthers {
    userData : AccountMySqlEntity
    message: string 
}

export class TestOutput implements WsOutput<TestOutputOthers> {
    event: string;
    data: AuthOutput<TestOutputOthers>;
}