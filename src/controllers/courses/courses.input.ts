import { AuthEmptyDataInput, AuthInput, MediaType } from "@common"
import { QuizQuestionAnswerMySqlEntity } from "@database"
import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsNumber, IsOptional, IsUUID, Length, Max, Min, max, min } from "class-validator"

export class CreateCourseInput implements AuthEmptyDataInput {
    @IsUUID("4")
    accountId: string
}

export class EnrollCourseInputData {
    @IsUUID("4")
    @ApiProperty()
    courseId: string
    @ApiProperty()
    code: string
}

export class EnrollCourseInput implements AuthInput<EnrollCourseInputData> {
    data: EnrollCourseInputData
    @IsUUID("4")
    accountId: string
}

export class CreateCourseTargetInputData {
    @IsUUID()
    @ApiProperty()
    courseId: string
    @ApiProperty()
    content: string
}

export class CreateCourseTargetInput
    implements AuthInput<CreateCourseTargetInputData> {
    @IsUUID("4")
    accountId: string
    data: CreateCourseTargetInputData
}

export class UpdateCourseTargetInputData {
    @IsUUID()
    @ApiProperty()
    courseTargetId: string
    @ApiProperty({ nullable: true })
    content?: string
    @ApiProperty({ nullable: true })
    position?: number
}

export class UpdateCourseTargetInput
    implements AuthInput<UpdateCourseTargetInputData> {
    @IsUUID("4")
    accountId: string
    data: UpdateCourseTargetInputData
}

export class UpdateCourseInputData {
    @IsUUID("4")
    @ApiProperty({ nullable: true })
    courseId: string

    @Length(20)
    @ApiProperty({ nullable: true })
    title?: string

    @Length(100)
    @ApiProperty({ nullable: true })
    description?: string

    @ApiProperty({ nullable: true })
    price?: number

    @ApiProperty({ nullable: true })
    discountPrice?: number

    @ApiProperty({ nullable: true })
    enableDiscount?: boolean

    @ApiProperty({ nullable: true })
    categoryId?: string

    @ApiProperty({ nullable: true })
    receivedWalletAddress?: string

    @ApiProperty({ nullable: true })
    subcategoryIds?: Array<string>

    @ApiProperty({ nullable: true })
    topicIds?: Array<string>

    @IsNumber()
    @ApiProperty({ nullable: true })
    thumbnailIndex?: number

    @IsNumber()
    @ApiProperty({ nullable: true })
    previewVideoIndex?: number
}

export class UpdateCourseInput implements AuthInput<UpdateCourseInputData> {
    @IsUUID("4")
    accountId: string
    data: UpdateCourseInputData
    files: Array<Express.Multer.File>
}

export class DeleteCourseTargetInputData {
    @IsUUID()
    @ApiProperty()
    courseTargetId: string
}

export class DeleteCourseTargetInput
    implements AuthInput<DeleteCourseTargetInputData> {
    @IsUUID("4")
    accountId: string
    @ApiProperty()
    data: DeleteCourseTargetInputData
}

export class CreateLessonInputData {
    @IsUUID("4")
    @ApiProperty()
    sectionId: string
    @ApiProperty()
    title: string
}

export class CreateLessonInput implements AuthInput<CreateLessonInputData> {
    @IsUUID("4")
    accountId: string
    data: CreateLessonInputData
}

export class DeleteLessonInputData {
    @IsUUID()
    @ApiProperty()
    lessonId: string
}

export class DeleteLessonInput
    implements AuthInput<DeleteLessonInputData> {
    @IsUUID("4")
    accountId: string
    @ApiProperty()
    data: DeleteLessonInputData
}


export class CreateSectionInputData {
    @IsUUID("4")
    @ApiProperty()
    courseId: string

    @ApiProperty()
    title: string
}

export class CreateSectionInput implements AuthInput<CreateSectionInputData> {
    @IsUUID("4")
    accountId: string
    data: CreateSectionInputData
}

export class CreateResourcesInputData {
    @IsUUID("4")
    @ApiProperty()
    lessonId: string
}
export class CreateResourcesInput implements AuthInput<CreateResourcesInputData> {
    @IsUUID("4")
    accountId: string
    data: CreateResourcesInputData
    files: Express.Multer.File[]
}

export class UpdateLessonInputData {
    @IsUUID("4")
    @ApiProperty()
    lessonId: string
    @ApiProperty({ nullable: true })
    title?: string
    @ApiProperty({ nullable: true })
    description?: string
    @ApiProperty({ nullable: true })
    thumbnailIndex?: number
    @ApiProperty({ nullable: true })
    lessonVideoIndex?: number
}

export class UpdateLessonInput implements AuthInput<UpdateLessonInputData> {
    @IsUUID("4")
    accountId: string
    data: UpdateLessonInputData
    files: Array<Express.Multer.File>
}

export class DeleteSectionInputData {
    @IsUUID()
    @ApiProperty()
    sectionId: string
}

export class DeleteSectionInput
    implements AuthInput<DeleteSectionInputData> {
    @IsUUID("4")
    accountId: string
    @ApiProperty()
    data: DeleteSectionInputData
}

export class UpdateSectionInputData {
    @IsUUID("4")
    @ApiProperty({ nullable: true })
    sectionId: string
    @ApiProperty({ nullable: true })
    title?: string
}

export class UpdateSectionInput implements AuthInput<UpdateSectionInputData> {
    @IsUUID("4")
    accountId: string
    data: UpdateSectionInputData
}

export class DeleteResourceInputData {
    @IsUUID()
    @ApiProperty()
    resourceId: string
}

export class DeleteResourceInput
    implements AuthInput<DeleteResourceInputData> {
    @IsUUID("4")
    accountId: string
    @ApiProperty()
    data: DeleteResourceInputData
}

//dev only apis
export class CreateCategoryInputData {
    @ApiProperty()
    name: string
    @ApiProperty({nullable: true})
    imageIndex?: number
    @ApiProperty({nullable: true})
    categoryIds: Array<string>
    @ApiProperty({nullable: true})
    categoryParentIds: Array<string>
}

export class CreateCategoryInput implements AuthInput<CreateCategoryInputData> {
    @IsUUID("4")
    accountId: string
    data: CreateCategoryInputData
    files: Array<Express.Multer.File>
}

//dev only apis
export class DeleteCategoryInputData {
    @ApiProperty()
    categoryId: string
}

export class DeleteCategoryInput implements AuthInput<DeleteCategoryInputData> {
    @IsUUID("4")
    accountId: string
    data: DeleteCategoryInputData
}

export class CreateCourseReviewInputData {
    @IsUUID()
    @ApiProperty()
    courseId: string
    @Length(10, 1000)
    @ApiProperty()
    content: string
    @Min(1)
    @Max(5)
    @ApiProperty()
    rating: number
}
export class CreateCourseReviewInput implements AuthInput<CreateCourseReviewInputData> {
    @IsUUID("4")
    accountId: string;
    data: CreateCourseReviewInputData;
}

export class UpdateCourseReviewInputData {
    @IsUUID()
    @ApiProperty()
    courseReviewId: string

    @IsOptional()
    @Length(10, 1000)
    @ApiProperty({ nullable: true })
    content: string

    @IsOptional()
    @Min(1)
    @Max(5)
    @ApiProperty({ nullable: true })
    rating: number
}

export class UpdateCourseReviewInput implements AuthInput<UpdateCourseReviewInputData> {
    @IsUUID("4")
    accountId: string;
    data: UpdateCourseReviewInputData
}

export class DeleteCourseReviewInputData {
    @IsUUID()
    @ApiProperty()
    courseReviewId: string
}
export class DeleteCourseReviewInput implements AuthInput<DeleteCourseReviewInputData> {
    @IsUUID("4")
    accountId: string;
    data: DeleteCourseReviewInputData;
}

export class CreateCertificateInputData {
    @IsUUID()
    @ApiProperty()
    courseId: string
}

export class CreateCertificateInput implements AuthInput<CreateCertificateInputData> {
    @IsUUID("4")
    accountId: string
    data: CreateCertificateInputData
}

export class QuizQuestionAnswerInputData {

    @ApiProperty()
    content: string

    @ApiProperty()
    isCorrect: boolean
}

export class QuizQuestionMediaInputData {
    @IsInt()
    @ApiProperty()
    mediaIndex: number

    @ApiProperty()
    mediaType: MediaType
}

export class QuizQuestionInputData {
    @ApiProperty()
    question: string

    @ApiProperty()
    @Min(10)
    point : number

    @ApiProperty()
    answers: Array<QuizQuestionAnswerInputData>

    @ApiProperty({ nullable: true })
    questionMedias?: Array<QuizQuestionMediaInputData>
}

export class CreateQuizInputData {
    @IsUUID("4")
    @ApiProperty()
    lessonId: string

    @ApiProperty()
    quizQuestions: Array<QuizQuestionInputData>

    @ApiProperty()
    @Min(5)
    timeLimit?: number

}

export class CreateQuizInput implements AuthInput<CreateQuizInputData> {
    @IsUUID("4")
    accountId: string
    data: CreateQuizInputData
    files?: Array<Express.Multer.File>
}

export class UpdateQuizQuestionAnswerInputData {
    @IsUUID("4")
    @ApiProperty()
    quizQuestionAnswerId: string

    @ApiProperty()
    content?: string

    @ApiProperty()
    isCorrect?: boolean
}

export class UpdateQuizQuestionInputData {
    @IsUUID("4")
    @ApiProperty({ nullable: true })
    quizQuestionId?: string

    @ApiProperty({ nullable: true })
    question?: string

    @ApiProperty({nullable: true })
    @Min(10)
    point? : number 

    @ApiProperty({ nullable: true })
    questionMedias?: Array<QuizQuestionMediaInputData>

    @ApiProperty({ nullable: true })
    quizAnswerIdsToUpdate?: Array<UpdateQuizQuestionAnswerInputData>

    @ApiProperty({ nullable: true })
    quizAnswerIdsToDelete?: Array<string>

    @ApiProperty({ nullable: true })
    mediaIdsToDelete?: Array<string>

    @ApiProperty({ nullable: true })
    newQuizQuestionAnswer?: Array<QuizQuestionAnswerInputData>
}

export class UpdateQuizInputData {
    @IsUUID("4")
    @ApiProperty()
    quizId: string

    @ApiProperty()
    @Min(5)
    timeLimit?: number

    @ApiProperty({ nullable: true })
    newQuestions?: Array<QuizQuestionInputData>

    @ApiProperty({ nullable: true })
    quizQuestionIdsToUpdate?: Array<UpdateQuizQuestionInputData>

    @ApiProperty({ nullable: true })
    quizQuestionIdsToDelete?: Array<string>
}

export class UpdateQuizInput implements AuthInput<UpdateQuizInputData> {
    @IsUUID("4")
    @ApiProperty()
    accountId: string
    data: UpdateQuizInputData
    files?: Array<Express.Multer.File>
}


export class DeleteQuizInputData {
    @ApiProperty()
    quizIds: Array<string>
}

export class DeleteQuizInput
    implements AuthInput<DeleteQuizInputData> {
    @IsUUID("4")
    @ApiProperty()
    accountId: string
    data: DeleteQuizInputData
}

export class CeateUserProgressInputData {
    @ApiProperty()
    lessonId: string
}

export class CeateUserProgressInput implements AuthInput<CeateUserProgressInputData> {
    @IsUUID("4")
    @ApiProperty()
    accountId: string
    data: CeateUserProgressInputData
}

export class MarkLessonAsCompletedInputData{
    @IsUUID("4")
    @ApiProperty()
    lessonId: string
}

export class MarkLessonAsCompletedInput implements AuthInput<MarkLessonAsCompletedInputData>{
    @IsUUID("4")
    @ApiProperty()
    accountId: string
    data: MarkLessonAsCompletedInputData
}

export class CreateQuizAttemptInputData {
    @IsUUID("4")
    @ApiProperty()
    quizId : string
}

export class CreateQuizAttemptInput implements AuthInput<CreateQuizAttemptInputData> {
    accountId: string
    data: CreateQuizAttemptInputData
}


export class FinishQuizAttemptInputData {
    @IsUUID("4")
    @ApiProperty()
    quizAttemptId : string

    @ApiProperty()
    quizQuestionAnswerIds: Array<string>
}

export class FinishQuizAttemptInput implements AuthInput<FinishQuizAttemptInputData>{
    accountId: string
    data: FinishQuizAttemptInputData
}

export class GiftCourseInputData {
    @ApiProperty()
    courseId: string

    @ApiProperty()
    receiveUserEmail : string

    @ApiProperty()
    code : string
}

export class GiftCourseInput implements AuthInput<GiftCourseInputData>{
    accountId: string
    data: GiftCourseInputData
}