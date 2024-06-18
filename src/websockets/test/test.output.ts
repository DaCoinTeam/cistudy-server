import { AuthOutput, WsOutput } from "@common";
import { AccountMySqlEntity } from "@database";

export class TestOutputOthers {
    userData: AccountMySqlEntity
    message: string
}

export class TestOutput implements WsOutput<TestOutputOthers> {
    event: string;
    data: AuthOutput<TestOutputOthers>;
}

export class TestNoAuthOthers {
    message: string
}

export class TestNoAuth implements WsOutput<TestNoAuthOthers> {
    event: string;
    data: AuthOutput<TestNoAuthOthers>;
}


export class RealTimeChatOutputOthers {
    message: string
}
export class RealTimeChatOutput implements WsOutput<RealTimeChatOutputOthers> {
    event: string;
    data: AuthOutput<RealTimeChatOutputOthers>;

}