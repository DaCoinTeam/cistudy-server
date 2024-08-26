import {
    AuthEmptyDataInput,
    AuthInput,
    MediaType,
    ReportProcessStatus,
    SectionContentType,
} from "@common"
import { ApiProperty } from "@nestjs/swagger"
import {
    IsNumber,
    IsOptional,
    IsUUID,
    Length,
    Max,
    Min,
    MinLength,
} from "class-validator"

export class AddSectionContentsInputData {
    @ApiProperty()
        type: SectionContentType
    @ApiProperty()
        title : string
    @ApiProperty()
        description : string
}

export class AddSectionInputData {
    @ApiProperty()
        sectionName: string
    @ApiProperty()
        sectionContents : Array<AddSectionContentsInputData>
}

export class AddCourseAPInputData {
    @ApiProperty()
        title: string
    @ApiProperty()
        description: string
    @ApiProperty()
        targets: Array<string>
    @ApiProperty()
        courseOutline : Array<AddSectionInputData>
}

export class AddCourseAPInput implements AuthInput<AddCourseAPInputData>{
    accountId: string
    data: AddCourseAPInputData
}

export class CreateCourseInput implements AuthEmptyDataInput {
  @IsUUID("4")
      accountId: string
}

export class CheckCumulativeAmountInputData {
  @ApiProperty()
      creatorWalletAddress: string
  @ApiProperty({ nullable: true })
      price?: number
}

export class CheckCumulativeAmountInput
implements AuthInput<CheckCumulativeAmountInputData>
{
    data: CheckCumulativeAmountInputData
  @IsUUID("4")
      accountId: string
}

export class EnrollCourseInputData {
  @IsUUID("4")
  @ApiProperty()
      courseId: string
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
implements AuthInput<CreateCourseTargetInputData>
{
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
implements AuthInput<UpdateCourseTargetInputData>
{
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
      receivedWalletAddress?: string

  @IsNumber()
  @ApiProperty({ nullable: true })
      thumbnailIndex?: number

  @IsNumber()
  @ApiProperty({ nullable: true })
      previewVideoIndex?: number

  @ApiProperty({ nullable: true })
      categoryIds?: Array<string>
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
implements AuthInput<DeleteCourseTargetInputData>
{
  @IsUUID("4")
      accountId: string
  @ApiProperty()
      data: DeleteCourseTargetInputData
}

export class CreateSectionContentInputData {
  @IsUUID("4")
  @ApiProperty()
      sectionId: string
  @ApiProperty()
      type: SectionContentType
}

export class CreateSectionContentInput
implements AuthInput<CreateSectionContentInputData>
{
  @IsUUID("4")
      accountId: string
  data: CreateSectionContentInputData
}

export class UpdateSectionContentInputData {
  @IsUUID("4")
  @ApiProperty()
      sectionContentId: string

  @ApiProperty()
      title: string
}

export class UpdateSectionContentInput
implements AuthInput<UpdateSectionContentInputData>
{
    accountId: string
    data: UpdateSectionContentInputData
}

export class DeleteSectionContentInputData {
  @IsUUID()
  @ApiProperty()
      sectionContentId: string
}

export class DeleteSectionContentInput
implements AuthInput<DeleteSectionContentInputData>
{
  @IsUUID("4")
      accountId: string
  @ApiProperty()
      data: DeleteSectionContentInputData
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
//
export class ResourceAttachmentInputData {
  @ApiProperty()
      fileIndex: number
}

export class UpdateResourceInputData {
  @IsUUID("4")
  @ApiProperty()
      resourceId: string
  @ApiProperty({ nullable: true })
      title?: string
  @ApiProperty({ nullable: true })
      description?: string
}

export class UpdateResourceInput implements AuthInput<UpdateResourceInputData> {
  @IsUUID("4")
      accountId: string
  data: UpdateResourceInputData
  files?: Express.Multer.File[]
}
//
export class CreateResourceInputData {
  @IsUUID("4")
  @ApiProperty()
      sectionId: string
  @ApiProperty()
      title: string
}
export class CreateResourceInput implements AuthInput<CreateResourceInputData> {
  @IsUUID("4")
      accountId: string
  data: CreateResourceInputData
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
  @ApiProperty({ nullable: true })
      isTrial?: boolean
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

export class DeleteSectionInput implements AuthInput<DeleteSectionInputData> {
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
  @ApiProperty()
      position: number
  @ApiProperty()
      isLocked: boolean
}

export class UpdateSectionInput implements AuthInput<UpdateSectionInputData> {
  @IsUUID("4")
      accountId: string
  data: UpdateSectionInputData
}

export class DeleteResourceAttachmentInputData {
  @IsUUID()
  @ApiProperty()
      resourceAttachmentId: string
}

export class DeleteResourceAttachmentInput
implements AuthInput<DeleteResourceAttachmentInputData>
{
  @IsUUID("4")
      accountId: string
  @ApiProperty()
      data: DeleteResourceAttachmentInputData
}

//dev only apis
export class CreateCategoryInputData {
  @ApiProperty()
      name: string
  @ApiProperty({ nullable: true })
      imageIndex?: number
  @ApiProperty({ nullable: true })
      categoryIds: Array<string>
  @ApiProperty({ nullable: true })
      categoryParentIds: Array<string>
}

export class CreateCategoryInput implements AuthInput<CreateCategoryInputData> {
  @IsUUID("4")
      accountId: string
  data: CreateCategoryInputData
  files?: Array<Express.Multer.File>
}

export class UpdateCategoryInputData {
  @IsUUID("4")
  @ApiProperty()
      categoryId: string
  @ApiProperty()
      name?: string
  @ApiProperty({ nullable: true })
      imageIndex?: number
}

export class UpdateCategoryInput implements AuthInput<UpdateCategoryInputData> {
    accountId: string
    data: UpdateCategoryInputData
    files?: Express.Multer.File[]
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

export class CreateCourseCategoriesInputData {
  @ApiProperty()
      courseId: string

  @ApiProperty()
      categoryIds: Array<string>
}

export class CreateCourseCategoriesInput
implements AuthInput<CreateCourseCategoriesInputData>
{
    accountId: string
    data: CreateCourseCategoriesInputData
}

export class DeleteCourseCategoryInputData {
  @ApiProperty()
      courseId: string

  @ApiProperty()
      categoryId: string
}

export class DeleteCourseCategoryInput
implements AuthInput<DeleteCourseCategoryInputData>
{
    accountId: string
    data: DeleteCourseCategoryInputData
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
export class CreateCourseReviewInput
implements AuthInput<CreateCourseReviewInputData>
{
  @IsUUID("4")
      accountId: string
  data: CreateCourseReviewInputData
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

export class UpdateCourseReviewInput
implements AuthInput<UpdateCourseReviewInputData>
{
  @IsUUID("4")
      accountId: string
  data: UpdateCourseReviewInputData
}

export class DeleteCourseReviewInputData {
  @IsUUID()
  @ApiProperty()
      courseReviewId: string
}
export class DeleteCourseReviewInput
implements AuthInput<DeleteCourseReviewInputData>
{
  @IsUUID("4")
      accountId: string
  data: DeleteCourseReviewInputData
}

export class CreateCertificateInputData {
  @IsUUID()
  @ApiProperty()
      courseId: string
}

export class CreateCertificateInput
implements AuthInput<CreateCertificateInputData>
{
  @IsUUID("4")
      accountId: string
  data: CreateCertificateInputData
}

export class QuizQuestionAnswerInputData {
  @ApiProperty()
      position: number

  @ApiProperty()
      content: string

  @ApiProperty()
      isCorrect: boolean
}

export class CreateQuizInputData {
  @IsUUID("4")
  @ApiProperty()
      sectionId: string

  @ApiProperty()
      title: string

  @ApiProperty()
  @Max(10)
      passingScore?: number

  @ApiProperty()
  @Min(5)
      timeLimit?: number
}

export class CreateQuizInput implements AuthInput<CreateQuizInputData> {
  @IsUUID("4")
      accountId: string
  data: CreateQuizInputData
}

export class UpdateQuizQuestionAnswerInputData {
  @IsUUID("4")
  @ApiProperty()
      quizQuestionAnswerId: string

  @ApiProperty()
      content?: string

  @ApiProperty()
      isCorrect?: boolean

  @ApiProperty()
      lastAnswer?: boolean

  @ApiProperty()
      swapPosition?: number
}

export class UpdateQuizInputData {
  @IsUUID("4")
  @ApiProperty()
      quizId: string

  @ApiProperty()
  @Min(5)
      timeLimit?: number
  @ApiProperty()
  @Max(100)
      passingPercent?: number
  @ApiProperty()
      title?: string
  @ApiProperty()
      description?: string
}

export class UpdateQuizInput implements AuthInput<UpdateQuizInputData> {
  @IsUUID("4")
  @ApiProperty()
      accountId: string
  data: UpdateQuizInputData
}

export class DeleteQuizInputData {
  @ApiProperty()
      quizIds: Array<string>
}

export class DeleteQuizInput implements AuthInput<DeleteQuizInputData> {
  @IsUUID("4")
  @ApiProperty()
      accountId: string
  data: DeleteQuizInputData
}

export class CeateAccountProgressInputData {
  @ApiProperty()
      lessonId: string
}

export class CeateAccountProgressInput
implements AuthInput<CeateAccountProgressInputData>
{
  @IsUUID("4")
  @ApiProperty()
      accountId: string
  data: CeateAccountProgressInputData
}

export class MarkContentAsCompletedInputData {
  @IsUUID("4")
  @ApiProperty()
      sectionContentId: string
}

export class MarkContentAsCompletedInput
implements AuthInput<MarkContentAsCompletedInputData>
{
  @IsUUID("4")
  @ApiProperty()
      accountId: string
  data: MarkContentAsCompletedInputData
}

export class CreateQuizAttemptInputData {
  @IsUUID("4")
  @ApiProperty()
      quizId: string
}

export class CreateQuizAttemptInput
implements AuthInput<CreateQuizAttemptInputData>
{
    accountId: string
    data: CreateQuizAttemptInputData
}

export class FinishQuizAttemptInputData {
  @IsUUID("4")
  @ApiProperty()
      quizAttemptId: string
}

export class FinishQuizAttemptInput
implements AuthInput<FinishQuizAttemptInputData>
{
    accountId: string
    data: FinishQuizAttemptInputData
}

export class GiftCourseInputData {
  @ApiProperty()
      courseId: string

  @ApiProperty()
      receiveAccountEmail: string

  @ApiProperty()
      code: string
}

export class GiftCourseInput implements AuthInput<GiftCourseInputData> {
    accountId: string
    data: GiftCourseInputData
}

export class CreateCourseReportInputData {
  @ApiProperty()
      courseId: string
  @ApiProperty()
  @MinLength(20)
      title: string
  @ApiProperty()
  @MinLength(20)
      description: string
}

export class CreateCourseReportInput
implements AuthInput<CreateCourseReportInputData>
{
    accountId: string
    data: CreateCourseReportInputData
}

export class UpdateCourseReportInputData {
  @IsUUID("4")
  @ApiProperty()
      reportCourseId: string
  @ApiProperty()
  @MinLength(20)
      title: string
  @ApiProperty()
  @MinLength(20)
      description: string
}

export class UpdateCourseReportInput
implements AuthInput<UpdateCourseReportInputData>
{
    accountId: string
    data: UpdateCourseReportInputData
}

export class ResolveCourseReportInputData {
  @ApiProperty()
  @IsUUID("4")
      reportCourseId: string
  @ApiProperty()
      processStatus: ReportProcessStatus
  @ApiProperty()
  @MinLength(20)
      processNote: string
}

export class ResolveCourseReportInput
implements AuthInput<ResolveCourseReportInputData>
{
    accountId: string
    data: ResolveCourseReportInputData
}

export class CreateQuestionInputData {
  @IsUUID("4")
  @ApiProperty()
      quizId: string
}

export class CreateQuestionInput implements AuthInput<CreateQuestionInputData> {
  @IsUUID("4")
      accountId: string
  data: CreateQuestionInputData
}

export class CreateQuizQuestionAnswerInputData {
  @ApiProperty()
      quizQuestionId: string
}

export class CreateQuizQuestionAnswerInput
implements AuthInput<CreateQuizQuestionAnswerInputData>
{
    accountId: string
    data: CreateQuizQuestionAnswerInputData
}

export class UpdateQuizQuestionAnswerInput
implements AuthInput<UpdateQuizQuestionAnswerInputData>
{
    accountId: string
    data: UpdateQuizQuestionAnswerInputData
}

export class DeleteQuizQuestionAnswerInputData {
  @ApiProperty()
      quizQuestionAnswerId: string
}

export class DeleteQuizQuestionAnswerInput
implements AuthInput<DeleteQuizQuestionAnswerInputData>
{
    accountId: string
    data: DeleteQuizQuestionAnswerInputData
}

export class CreateQuizQuestionInputData {
  @ApiProperty()
      quizId: string
}

export class CreateQuizQuestionInput
implements AuthInput<CreateQuizQuestionInputData>
{
    accountId: string
    data: CreateQuizQuestionInputData
}

export class UpdateQuizQuestionMediaInputData {
  @ApiProperty()
      mediaIndex: number
  @ApiProperty()
      mediaType: MediaType
}

export class UpdateQuizQuestionInputData {
  @ApiProperty()
      quizQuestionId: string
  @ApiProperty()
      question: string
  @ApiProperty()
      point: number
  @ApiProperty()
      swapPosition: number
  @ApiProperty()
      questionMedia: UpdateQuizQuestionMediaInputData
  @ApiProperty()
      deleteMedia?: boolean
}

export class UpdateQuizQuestionInput
implements AuthInput<UpdateQuizQuestionInputData>
{
    accountId: string
    data: UpdateQuizQuestionInputData
    files?: Express.Multer.File[]
}

export class DeleteQuizQuestionInputData {
  @ApiProperty()
      quizQuestionId: string
}

export class DeleteQuizQuestionInput
implements AuthInput<DeleteQuizQuestionInputData>
{
    accountId: string
    data: DeleteQuizQuestionInputData
}

export class PublishCourseInputData {
  @ApiProperty()
      courseId: string
}
export class PublishCourseInput implements AuthInput<PublishCourseInputData> {
    accountId: string
    data: PublishCourseInputData
}

export class UpdateQuizAttemptInputData {
  @ApiProperty()
      quizAttemptId: string
  @ApiProperty()
      currentQuestionPosition?: number
  @ApiProperty()
      quizId: string
}

export class UpdateQuizAttemptInput
implements AuthInput<UpdateQuizAttemptInputData>
{
    accountId: string
    data: UpdateQuizAttemptInputData
}

export class UpdateQuizAttemptAnswersInputData {
  @ApiProperty()
      quizAttemptId: string
  @ApiProperty()
      quizQuestionId: string
  @ApiProperty()
      quizQuestionAnswerIds: Array<string>
  @ApiProperty()
      quizId: string
}

export class UpdateQuizAttemptAnswersInput
implements AuthInput<UpdateQuizAttemptAnswersInputData>
{
    accountId: string
    data: UpdateQuizAttemptAnswersInputData
}

export class MarkAsCompleteResourceInputData {
  @IsUUID("4")
  @ApiProperty()
      resourceId: string
}

export class MarkAsCompletedResourceInput
implements AuthInput<MarkAsCompleteResourceInputData>
{
    accountId: string
    data: MarkAsCompleteResourceInputData
}

export class UpdateLessonProgressInputData {
  @IsUUID("4")
  @ApiProperty()
      lessonId: string
  @ApiProperty()
      completePercent?: number
  @ApiProperty()
      completeFirstWatch?: boolean
}

export class UpdateLessonProgressInput
implements AuthInput<UpdateLessonProgressInputData>
{
    accountId: string
    data: UpdateLessonProgressInputData
}


export class DeleteCourseInputData {
    @IsUUID("4")
    @ApiProperty()
        courseId: string
}
  
export class DeleteCourseInput
implements AuthInput<DeleteCourseInputData>
{
    accountId: string
    data: DeleteCourseInputData
}

export class DeleteAdminCourseInputData {
    @IsUUID("4")
    @ApiProperty()
        courseId: string
}

export class DeleteAdminCourseInput implements AuthInput<DeleteAdminCourseInputData> {
    accountId: string
    data: DeleteAdminCourseInputData
}
