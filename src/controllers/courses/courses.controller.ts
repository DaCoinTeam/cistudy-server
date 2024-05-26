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
    CreateCourseInput,
    CreateCourseReviewInput,
    CreateCourseReviewInputData,
    CreateCourseTargetInputData,
    CreateLectureInputData,
    CreateResourcesInputData,
    CreateSectionInputData,
    CreateSubcategoryInputData,
    CreateTopicInputData,
    EnrollCourseInputData,
    UpdateCourseInputData,
    UpdateCourseReviewInputData,
    UpdateCourseTargetInputData,
    UpdateLectureInputData,
    UpdateSectionInputData,
} from "./courses.input"

import {
    createResourcesSchema,
    createTopicSchema,
    updateCourseSchema,
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

    @ApiBearerAuth()
    @Patch("enroll-course")
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
            data : body,
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
            data : body,
        })
    }

    @ApiBearerAuth()
    @Delete("delete-course-review/:reviewId")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async deleteCourseReview(
        @UserId() userId: string,
        @Param("reviewId") reviewId : string,
    ) {
        return this.coursesService.deleteCourseReview({ 
            userId,
            data : {reviewId}
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
}
