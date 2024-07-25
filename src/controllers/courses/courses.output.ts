import { Output } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class CreateCourseOutputOthers {
    @ApiProperty()
        courseId: string
}

export class CheckCumulativeAmountOutput implements Output<CheckCumulativeAmountOutputOthers> {
    message: string
    others: CheckCumulativeAmountOutputOthers
}
export class CheckCumulativeAmountOutputOthers {
    @ApiProperty()
        enough: boolean
    @ApiProperty()
        cummulativeAmount: string
    @ApiProperty()
        differentAmounts: string
}

export class CreateCourseOutput implements Output<CreateCourseOutputOthers> {
    message: string
    others: CreateCourseOutputOthers
}
export class EnrollCourseOuputOthers {
    @ApiProperty()
        enrolledInfoId: string
}
export class EnrollCourseOutput implements Output<EnrollCourseOuputOthers> {
    message: string
    others: EnrollCourseOuputOthers
}

export class UpdateCourseOutput implements Output {
    message: string
}

export class CreateCategoryOutputOthers {
    @ApiProperty()
        categoryId: string
}

export class CreateCategoryOutput implements Output<CreateCategoryOutputOthers> {
    message: string
    others: CreateCategoryOutputOthers
}

export class DeleteCategoryOutput implements Output {
    message: string
}

export class CreateSubcategoryOutputOthers {
    @ApiProperty()
        subcategoryId: string
}

export class CreateSubcategoryOutput implements Output<CreateSubcategoryOutputOthers> {
    message: string
    others: CreateSubcategoryOutputOthers
}

export class CreateTopicOutputOthers {
    @ApiProperty()
        topicId: string
}

export class CreateTopicOutput implements Output<CreateTopicOutputOthers> {
    message: string
    others: CreateTopicOutputOthers
}

export class DeleteTopicOutputData implements Output {
    message: string
}

export class CreateCourseReviewOutput implements Output {
    message: string
}

export class UpdateCourseReviewOutput implements Output {
    message: string
}

export class DeleteCourseReviewOutput implements Output {
    message: string
}

export class CreateCertificateOutputOthers {
    @ApiProperty()
        certificateId: string
}

export class CreateCertificateOutput implements Output<CreateCertificateOutputOthers> {
    message: string
    others?: CreateCertificateOutputOthers
}

export class DeleteQuizOutput implements Output {
    message: string
}

export class UpdateQuizOutput implements Output {
    message: string
}

export class MarkContentAsCompletedOutput implements Output {
    message: string
}

export class CreateQuizAttemptOutputOthers {
    @IsUUID()
    @ApiProperty()
        quizAttemptId: string
}

export class CreateQuizAttemptOutput implements Output<CreateQuizAttemptOutputOthers> {
    message: string
    others?: CreateQuizAttemptOutputOthers
}

export class FinishQuizAttemptOutputOther {
    score : number
}
export class FinishQuizAttemptOutput implements Output<FinishQuizAttemptOutputOther> {
    message: string
    others?: FinishQuizAttemptOutputOther
}

export class GiftCourseOutput implements Output {
    message: string
}

export class CreateCourseCategoriesOutput implements Output {
    message: string
}

export class DeleteCourseCategoryOutput implements Output {
    message: string
}

export class CreateSectionOutput implements Output {
    message: string
}

export class UpdateLessonOutput implements Output {
    message: string
}
//
export class DeleteSectionContentOutput implements Output {
    message: string
}

export class CreateCourseTargetOuput implements Output {
    message: string
}

export class UpdateCourseTargetOuput implements Output {
    message: string
}

export class DeleteCourseTargetOuput implements Output {
    message: string
}

export class CreateResourcesOuput implements Output {
    message: string
}

export class UpdateSectionOuput implements Output {
    message: string
}

export class DeleteSectionOuput implements Output {
    message: string
}

export class DeleteResourceAttachmentOuput implements Output {
    message: string
}

export class CreateQuizOutput implements Output {
    message: string
}

export class CreateSectionContentOutput implements Output {
    message: string
}

export class CreateCourseReportOutputOthers{
    @IsUUID("4")
        reportCourseId : string
}

export class CreateCourseReportOutput implements Output<CreateCourseReportOutputOthers> {
    message: string
    others?: CreateCourseReportOutputOthers
}

export class UpdateCourseReportOutputOthers{
    @IsUUID("4")
        reportCourseId : string
}

export class UpdateCourseReportOutput implements Output<UpdateCourseReportOutputOthers> {
    message: string
    others?: UpdateCourseReportOutputOthers
}

export class ResolveCourseReportOutput implements Output {
    message: string
}

export class UpdateResourceOutput implements Output {
    message: string
}



export class CreateQuizQuestionAnswerOutput implements Output {
    message: string
}

export class UpdateQuizQuestionAnswerOutput implements Output {
    message: string
}

export class DeleteQuizQuestionAnswerOutput implements Output {
    message: string
}

export class CreateQuizQuestionOutput implements Output {
    message: string
}

export class UpdateQuizQuestionOutput implements Output {
    message: string
}

export class DeleteQuizQuestionOutput implements Output {
    message: string
}

export class PublishCourseOutput implements Output {
    message: string
}

export class UpdateSectionContentOuput implements Output {
    message: string
}

