import { AuthOutput, AuthTokens, Output } from "@common";
import { IsUUID } from "class-validator";

export class VerifyCourseOuputOther {
    courseId : string
}

export class VerifyCourseOuput implements Output<VerifyCourseOuputOther>{
    message: string;
    others : VerifyCourseOuputOther
}

export class CreateUserReviewOutputOthers {
    @IsUUID("4")
    userReviewId : string
}

export class CreateUserReviewOutput implements Output<CreateUserReviewOutputOthers>{
    message: string;
    others?: CreateUserReviewOutputOthers;
}