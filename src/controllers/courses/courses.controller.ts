import {
    Controller,
    Post,
    UseInterceptors,
    UseGuards,
    UploadedFiles,
    Body,
    Put,
    Delete,
    Param,
    Patch,
} from "@nestjs/common"
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiHeader,
    ApiTags,
} from "@nestjs/swagger"
import {
    AccountId,
    AuthInterceptor,
    JwtAuthGuard,
    DataFromBody,
    Roles,
    RolesGuard
} from "../shared"
import {
    CreateCategoryInputData,
    CreateCertificateInputData,
    CreateCourseCategoriesInputData,
    CreateCourseReportInputData,
    CreateCourseReviewInputData,
    CreateCourseTargetInputData,
    CreateSectionContentInputData,
    CreateQuizAttemptInputData,
    CreateSectionInputData,
    DeleteCourseCategoryInputData,
    EnrollCourseInputData,
    FinishQuizAttemptInputData,
    MarkContentAsCompletedInputData,
    ResolveCourseReportInputData,
    UpdateCourseInputData,
    UpdateCourseReportInputData,
    UpdateCourseReviewInputData,
    UpdateCourseTargetInputData,
    UpdateLessonInputData,
    UpdateQuizInputData,
    UpdateSectionInputData,
    UpdateResourceInputData,
    CreateQuizQuestionInputData,
    CreateQuizQuestionAnswerInputData,
    UpdateQuizQuestionInputData,
    UpdateQuizQuestionAnswerInputData,
    PublishCourseInputData,
    UpdateCategoryInputData,
    UpdateQuizAttemptInputData,
    UpdateQuizAttemptAnswersInputData,
    MarkAsCompleteResourceInputData,
    UpdateLessonProgressInputData,
} from "./courses.input"

import {
    createCategorySchema,
    updateCategorySchema,
    updateCourseSchema,
    updateLessonSchema,
    UpdateResourceSchema
} from "./courses.schema"

import { Files, SystemRoles } from "@common"
import { CoursesService } from "./courses.service"
import { FileFieldsInterceptor } from "@nestjs/platform-express"

@ApiTags("Courses")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/courses")
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @ApiBearerAuth()
    @Post("create-course")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User, SystemRoles.Instructor)
    @UseInterceptors(AuthInterceptor)
    async createCourse(@AccountId() accountId: string) {
        return await this.coursesService.createCourse({
            accountId,
        })
    }

    @ApiBearerAuth()
    @Patch("publish-course")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async publishCourse(
        @AccountId() accountId: string,
        @Body() data : PublishCourseInputData
    ) {
        return await this.coursesService.publishCourse({
            accountId,
            data
        })
    }
    // trang trí để cho swagger biết đây là api cần auth
    @ApiBearerAuth()
    @Patch("enroll-course")
    // cái route này xài JWT Guard, tức là nếu jwt hợp lệ thì qua cửa, còn không hợp lệ thì 401
    @UseGuards(JwtAuthGuard, RolesGuard)
    //@Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async enrollCourse(
        @AccountId() accountId: string,
        @Body() data: EnrollCourseInputData,
    ) {
        return await this.coursesService.enrollCourse({
            accountId,
            data,
        })
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: updateCourseSchema })
    @Put("update-course")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(
        AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 2 }]),
    )
    async updateCourse(
        @AccountId() accountId: string,
        @DataFromBody() data: UpdateCourseInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return this.coursesService.updateCourse({
            accountId,
            data,
            files,
        })
    }

    @ApiBearerAuth()
    @Post("create-course-review")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async createCourseReview(
        @AccountId() accountId: string,
        @Body() body: CreateCourseReviewInputData,
    ) {
        return this.coursesService.createCourseReview({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Patch("update-course-review")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async updateCourseReview(
        @AccountId() accountId: string,
        @Body() body: UpdateCourseReviewInputData,
    ) {
        return this.coursesService.updateCourseReview({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-course-review/:courseReviewId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deleteCourseReview(
        @AccountId() accountId: string,
        @Param("courseReviewId") courseReviewId: string,
    ) {
        return this.coursesService.deleteCourseReview({
            accountId,
            data: { courseReviewId },
        })
    }

    @ApiBearerAuth()
    @Post("create-course-target")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async createCourseTarget(
        @AccountId() accountId: string,
        @Body() body: CreateCourseTargetInputData,
    ) {
        return this.coursesService.createCourseTarget({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Put("update-course-target")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async updateCourseTarget(
        @AccountId() accountId: string,
        @Body() body: UpdateCourseTargetInputData,
    ) {
        return this.coursesService.updateCourseTarget({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-course-target/:courseTargetId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deleteCoureTarget(
        @AccountId() accountId: string,
        @Param("courseTargetId") courseTargetId: string,
    ) {
        return this.coursesService.deleteCourseTarget({
            accountId,
            data: { courseTargetId },
        })
    }

    @ApiBearerAuth()
    @Post("create-section")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async createSection(
        @AccountId() accountId: string,
        @Body() body: CreateSectionInputData,
    ) {
        return this.coursesService.createSection({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Post("create-section-content")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async createSectionContent(
        @AccountId() accountId: string,
        @Body() data: CreateSectionContentInputData,
    ) {
        return this.coursesService.createSectionContent({
            accountId,
            data,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-section-content/:sectionContentId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deleteLesson(
        @AccountId() accountId: string,
        @Param("sectionContentId") sectionContentId: string,
    ) {
        return this.coursesService.deleteSectionContent({
            accountId,
            data: { sectionContentId },
        })
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: UpdateResourceSchema })
    @Patch("update-resource")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(
        AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 10 }]),
    )
    async updateResource(
        @AccountId() accountId: string,
        @DataFromBody() data: UpdateResourceInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return this.coursesService.updateResource({
            accountId,
            data,
            files,
        })
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: updateLessonSchema })
    @Put("update-lesson")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(
        AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 2 }]),
    )
    async updateLesson(
        @AccountId() accountId: string,
        @DataFromBody() data: UpdateLessonInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return this.coursesService.updateLesson({
            accountId,
            data,
            files,
        })
    }

    @ApiBearerAuth()
    @Put("update-section")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async updateSection(
        @AccountId() accountId: string,
        @Body() body: UpdateSectionInputData,
    ) {
        return this.coursesService.updateSection({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-section/:sectionId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deleteSection(
        @AccountId() accountId: string,
        @Param("sectionId") sectionId: string,
    ) {
        return this.coursesService.deleteSection({
            accountId,
            data: { sectionId },
        })
    }

    @ApiBearerAuth()
    @Delete("delete-resource-attachment/:resourceAttachmentId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deleteResource(
        @AccountId() accountId: string,
        @Param("resourceAttachmentId") resourceAttachmentId: string,
    ) {
        return this.coursesService.deleteResourceAttachment({
            accountId,
            data: { resourceAttachmentId },
        })
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: createCategorySchema })
    @Post("create-category")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(
        AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 1 }]),
    )
    async createCategory(
        @AccountId() accountId: string,
        @DataFromBody() data: CreateCategoryInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return this.coursesService.createCategory({
            accountId,
            data,
            files,
        })
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: updateCategorySchema })
    @Patch("update-category")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(
        AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 1 }]),
    )
    async updateCategory(
        @AccountId() accountId: string,
        @DataFromBody() data: UpdateCategoryInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return this.coursesService.updateCategory({
            accountId,
            data,
            files,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-category/:categoryId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deleteCategory(
        @AccountId() accountId: string,
        @Param("categoryId") categoryId: string,
    ) {
        return await this.coursesService.deleteCategory({
            accountId,
            data: {
                categoryId,
            },
        })
    }

    @ApiBearerAuth()
    @Post("create-course-category")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async createCourseCategories(
        @AccountId() accountId: string,
        @Body() data: CreateCourseCategoriesInputData,
    ) {
        return this.coursesService.createCourseCategories({
            accountId,
            data,
        })
    }

    @ApiBearerAuth()
    @Post("delete-course-category")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deleteCourseCategories(
        @AccountId() accountId: string,
        @Body() data: DeleteCourseCategoryInputData,
    ) {
        return this.coursesService.deleteCourseCategory({
            accountId,
            data,
        })
    }

    @ApiBearerAuth()
    @Post("create-course-certificate")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async createCourseCertificate(
        @AccountId() accountId: string,
        @Body() data: CreateCertificateInputData,
    ) {
        return await this.coursesService.createCourseCertificate({
            accountId,
            data,
        })
    }

    @ApiBearerAuth()
    @Put("update-quiz")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async updateQuiz(
        @AccountId() accountId: string,
        @Body() data: UpdateQuizInputData,
    ) {
        return await this.coursesService.updateQuiz({ accountId, data})
    }

    @ApiBearerAuth()
    @Post("create-quiz-question")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async createQuizQuestion(
        @AccountId() accountId: string,
        @Body() data: CreateQuizQuestionInputData,
    ) {
        return await this.coursesService.createQuizQuestion({
            accountId,
            data
        })
    }

    @ApiBearerAuth()
    @Post("create-quiz-question-answer")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async createQuizQuestionAnswer(
        @AccountId() accountId: string,
        @Body() data: CreateQuizQuestionAnswerInputData,
    ) {
        return await this.coursesService.createQuizQuestionAnswer({
            accountId,
            data
        })
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @Patch("update-quiz-question")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 10 }]),
    )
    async updateQuizQuestion(
        @AccountId() accountId: string,
        @DataFromBody() data: UpdateQuizQuestionInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return await this.coursesService.updateQuizQuestion({
            accountId,
            data,
            files
        })
    }

    @ApiBearerAuth()
    @Patch("update-quiz-question-answer")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async updateQuizQuestionAnswer(
        @AccountId() accountId: string,
        @Body() data: UpdateQuizQuestionAnswerInputData,
    ) {
        return await this.coursesService.updateQuizQuestionAnswer({
            accountId,
            data
        })
    }

    //
    @ApiBearerAuth()
    @Delete("delete-quiz-question/:quizQuestionId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deleteQuizQuestion(
        @AccountId() accountId: string,
        @Param("quizQuestionId") quizQuestionId: string,
    ) {
        return this.coursesService.deleteQuizQuestion({
            accountId,
            data: { quizQuestionId },
        })
    }

    @ApiBearerAuth()
    @Delete("delete-quiz-question-answer/:quizQuestionAnswerId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deleteQuizQuestionAnswer(
        @AccountId() accountId: string,
        @Param("quizQuestionAnswerId") quizQuestionAnswerId: string,
    ) {
        return this.coursesService.deleteQuizQuestionAnswer({
            accountId,
            data: { quizQuestionAnswerId },
        })
    }
    @ApiBearerAuth()
    @Post("mark-content-complete")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async markContentComplete(
        @AccountId() accountId: string,
        @Body() data: MarkContentAsCompletedInputData,
    ) {
        return await this.coursesService.markContentAsCompleted({
            accountId,
            data,
        })
    }

    @ApiBearerAuth()
    @Post("create-quiz-attempt")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async createQuizAttempt(
        @AccountId() accountId: string,
        @Body() data: CreateQuizAttemptInputData,
    ) {
        return await this.coursesService.createQuizAttempt({ accountId, data })
    }

    @ApiBearerAuth()
    @Post("finish-quiz-attempt")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async finishQuizAttempt(
        @AccountId() accountId: string,
        @Body() data: FinishQuizAttemptInputData,
    ) {
        return await this.coursesService.finishQuizAttempt({ accountId, data })
    }

    @ApiBearerAuth()
    @Post("create-course-report")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async createCourseReport(
        @AccountId() accountId: string,
        @Body() body: CreateCourseReportInputData,
    ) {
        return this.coursesService.createCourseReport({
            accountId,
            data: body,
        })
    }
    
    @ApiBearerAuth()
    @Patch("update-course-report")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async updateCourseReport(
        @AccountId() accountId: string,
        @Body() body: UpdateCourseReportInputData,
    ) {
        return this.coursesService.updateCourseReport({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Patch("resolve-course-report")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User, SystemRoles.Moderator)
    @UseInterceptors(AuthInterceptor)
    async resolveAccountReport(
        @AccountId() accountId: string,
        @Body() body: ResolveCourseReportInputData,
    ) {
        return this.coursesService.resolveCourseReport({
            accountId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Post("create-quiz-question")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async createQuestion(
        @AccountId() accountId: string,
        @Body() data: CreateQuizQuestionInputData,
    ) {
        return this.coursesService.createQuizQuestion({
            accountId,
            data,
        })
    }

    @ApiBearerAuth()
    @Patch("update-quiz-attempt")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async updateQuizAttempt(
        @AccountId() accountId: string,
        @Body() data: UpdateQuizAttemptInputData,
    ) {
        return this.coursesService.updateQuizAttempt({
            accountId,
            data,
        })
    }

    @ApiBearerAuth()
    @Patch("update-quiz-attempt-answers")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async updateQuizAttemptAnswers(
        @AccountId() accountId: string,
        @Body() data: UpdateQuizAttemptAnswersInputData,
    ) {
        return this.coursesService.updateQuizAttemptAnswers({
            accountId,
            data,
        })
    }

    @ApiBearerAuth()
    @Patch("mark-as-completed-resource")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async markAsCompletedResource(
        @AccountId() accountId: string,
        @Body() data: MarkAsCompleteResourceInputData,
    ) {
        return this.coursesService.markAsCompletedResource({
            accountId,
            data,
        })
    }

    @ApiBearerAuth()
    @Put("update-lesson-progress")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async updateLessonProgress(
        @AccountId() accountId: string,
        @Body() data: UpdateLessonProgressInputData,
    ) {
        return this.coursesService.updateLessonProgress({
            accountId,
            data,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-course/:courseId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRoles.User)
    @UseInterceptors(AuthInterceptor)
    async deleteCourse(
        @AccountId() accountId: string,
        @Param("courseId") courseId: string,
    ) {
        return this.coursesService.deleteCourse({
            accountId,
            data: { courseId },
        })
    }

    @ApiBearerAuth()
    @Delete("delete-admin-course/:courseId")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async deleteAdminCourse(
        @AccountId() accountId: string,
        @Param("courseId") courseId: string,
    ) {
        return this.coursesService.deleteAdminCourse({
            accountId,
            data: { courseId },
        })
    }
}
