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
import { UserId, AuthInterceptor, JwtAuthGuard, DataFromBody } from "../shared"
import {
    CreateCategoryInputData,
    CreateCertificateInputData,
    CreateCourseReviewInputData,
    CreateCourseTargetInputData,
    CreateLectureInputData,
    CreateQuizInputData,
    CreateResourcesInputData,
    CreateSectionInputData,
    CreateSubcategoryInputData,
    CreateTopicInputData,
    DeleteQuizInputData,
    EnrollCourseInputData,
    MarkLectureAsCompletedInputData,
    UpdateCourseInputData,
    UpdateCourseReviewInputData,
    UpdateCourseTargetInputData,
    UpdateLectureInputData,
    UpdateQuizInputData,
    //UpdateQuizInputData,
    UpdateSectionInputData,
} from "./courses.input"

import {
    createQuizSchema,
    createResourcesSchema,
    createTopicSchema,
    updateCourseSchema,
    updateQuizSchema,
} from "./courses.schema"

import { Files } from "@common"
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
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async createCourse(@UserId() userId: string) {
        return await this.coursesService.createCourse({
            userId,
        })
    }

    // trang trí để cho swagger biết đây là api cần auth
    @ApiBearerAuth()
    @Patch("enroll-course")
    // cái route này xài JWT Guard, tức là nếu jwt hợp lệ thì qua cửa, còn không hợp lệ thì 401
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async enrollCourse(
        @UserId() userId: string,
        @Body() data: EnrollCourseInputData,
    ) {
        return await this.coursesService.enrollCourse({
            userId,
            data,
        })
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: updateCourseSchema })
    @Put("update-course")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 2 }]),
    )
    async updateCourse(
        @UserId() userId: string,
        @DataFromBody() data: UpdateCourseInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return this.coursesService.updateCourse({
            userId,
            data,
            files,
        })
    }

    @ApiBearerAuth()
    @Post("create-course-review")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async createCourseReview(
        @UserId() userId: string,
        @Body() body: CreateCourseReviewInputData,
    ) {
        return this.coursesService.createCourseReview({
            userId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Patch("update-course-review")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async updateCourseReview(
        @UserId() userId: string,
        @Body() body: UpdateCourseReviewInputData,
    ) {
        return this.coursesService.updateCourseReview({
            userId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-course-review/:courseReviewId")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async deleteCourseReview(
        @UserId() userId: string,
        @Param("courseReviewId") courseReviewId: string,
    ) {
        return this.coursesService.deleteCourseReview({
            userId,
            data: { courseReviewId }
        })
    }

    @ApiBearerAuth()
    @Post("create-course-target")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async createCourseTarget(
        @UserId() userId: string,
        @Body() body: CreateCourseTargetInputData,
    ) {
        return this.coursesService.createCourseTarget({
            userId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Put("update-course-target")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async updateCourseTarget(
        @UserId() userId: string,
        @Body() body: UpdateCourseTargetInputData,
    ) {
        return this.coursesService.updateCourseTarget({
            userId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-course-target/:courseTargetId")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async deleteCoureTarget(
        @UserId() userId: string,
        @Param("courseTargetId") courseTargetId: string,
    ) {
        return this.coursesService.deleteCourseTarget({
            userId,
            data: { courseTargetId },
        })
    }

    @ApiBearerAuth()
    @Post("create-section")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async createSection(
        @UserId() userId: string,
        @Body() body: CreateSectionInputData,
    ) {
        return this.coursesService.createSection({
            userId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Post("create-lecture")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async createLecture(
        @UserId() userId: string,
        @Body() data: CreateLectureInputData,
    ) {
        return this.coursesService.createLecture({
            userId,
            data,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-lecture/:lectureId")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async deleteLecture(
        @UserId() userId: string,
        @Param("lectureId") lectureId: string,
    ) {
        return this.coursesService.deleteLecture({
            userId,
            data: { lectureId },
        })
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: createResourcesSchema })
    @Post("create-resources")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 10 }]),
    )
    async createResoures(
        @UserId() userId: string,
        @DataFromBody() data: CreateResourcesInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return this.coursesService.createResources({
            userId,
            data,
            files,
        })
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: createResourcesSchema })
    @Put("update-lecture")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 2 }]),
    )
    async updateLecture(
        @UserId() userId: string,
        @DataFromBody() data: UpdateLectureInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return this.coursesService.updateLecture({
            userId,
            data,
            files,
        })
    }

    @ApiBearerAuth()
    @Put("update-section")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async updateSection(
        @UserId() userId: string,
        @Body() body: UpdateSectionInputData,
    ) {
        return this.coursesService.updateSection({
            userId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-section/:sectionId")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async deleteSection(
        @UserId() userId: string,
        @Param("sectionId") sectionId: string,
    ) {
        return this.coursesService.deleteSection({
            userId,
            data: { sectionId },
        })
    }

    @ApiBearerAuth()
    @Delete("delete-resource/:resourceId")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async deleteResource(
        @UserId() userId: string,
        @Param("resourceId") resourceId: string,
    ) {
        return this.coursesService.deleteResource({
            userId,
            data: { resourceId },
        })
    }

    @ApiBearerAuth()
    @Post("create-category")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async createCategory(
        @UserId() userId: string,
        @Body() body: CreateCategoryInputData,
    ) {
        return this.coursesService.createCategory({
            userId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Post("create-subcategory")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async createSubcategory(
        @UserId() userId: string,
        @Body() body: CreateSubcategoryInputData,
    ) {
        return this.coursesService.createSubcategory({
            userId,
            data: body,
        })
    }

    @ApiBearerAuth()
    @Post("create-topic")
    @UseGuards(JwtAuthGuard)
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: createTopicSchema })
    @UseInterceptors(
        AuthInterceptor,
        FileFieldsInterceptor([{ name: "files", maxCount: 1 }]),
    )
    async createTopic(
        @UserId() userId: string,
        @DataFromBody() data: CreateTopicInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return this.coursesService.createTopic({
            userId,
            data,
            files,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-topic/:topicId")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async deleteTopic(
        @UserId() userId: string,
        @Param("topicId") topicId: string,
    ) {
        return this.coursesService.deleteTopic({
            userId,
            data: { topicId },
        })
    }

    @ApiBearerAuth()
    @Post("create-course-certificate")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async createCourseCertificate(
        @UserId() userId: string,
        @Body() data: CreateCertificateInputData,
    ) {
        return await this.coursesService.createCourseCertificate({ userId, data })
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: createQuizSchema })
    @Post("create-quiz")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor, FileFieldsInterceptor([{ name: "files" }]))
    async createQuiz(
        @UserId() userId: string,
        @DataFromBody() data: CreateQuizInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return await this.coursesService.createQuiz({ userId, data, files })
    }

    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({ schema: updateQuizSchema })
    @Put("update-quiz")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor, FileFieldsInterceptor([{ name: "files" }]))
    async updateQuiz(
        @UserId() userId: string,
        @DataFromBody() data: UpdateQuizInputData,
        @UploadedFiles() { files }: Files,
    ) {
        return await this.coursesService.updateQuiz({ userId, data, files })
    }

    @ApiBearerAuth()
    @Post("mark-lecture-complete")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async deleteQuiz(
        @UserId() userId: string,
        @Body() data: MarkLectureAsCompletedInputData
    ) {
        return await this.coursesService.markLectureAsCompleted({
            userId, data
        })
    }
}
