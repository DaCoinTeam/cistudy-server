import { AuthOutput, AuthTokens, Output } from "@common";

export class UpdateCourseApproveStatusOuputOther {
    courseId : string
}

export class UpdateCourseApproveStatusOuput implements Output<UpdateCourseApproveStatusOuputOther>{
    message: string;
    others : UpdateCourseApproveStatusOuputOther
}