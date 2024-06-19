import { AuthOutput, Output } from "@common"
import { ApiProperty, ApiResponse } from "@nestjs/swagger"
import { IsOptional, IsUUID } from "class-validator"

export class CreateCourseOutputOthers {
    @ApiProperty()
    courseId: string
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
    others?: CreateCertificateOutputOthers;
}

export class DeleteQuizOutput implements Output {
    message: string
}

export class UpdateQuizOutput implements Output {
    message: string;
}

export class MarkLessonAsCompletedOutput implements Output {
    message: string
}

export class CreateQuizAttemptOutputOthers {
    @IsUUID()
    @ApiProperty()
    quizAttemptId: string
}

export class CreateQuizAttemptOutput implements Output<CreateQuizAttemptOutputOthers> {
    message: string;
    others?: CreateQuizAttemptOutputOthers;
}

export class FinishQuizAttemptOutputOther {
    score : number
}
export class FinishQuizAttemptOutput implements Output<FinishQuizAttemptOutputOther> {
    message: string
    others?: FinishQuizAttemptOutputOther;
}

export class GiftCourseOutput implements Output {
    message: string;
}