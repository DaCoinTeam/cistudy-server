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
} from "../shared"
import {
  CreateCategoryInputData,
  CreateCertificateInputData,
  CreateCourseReviewInputData,
  CreateCourseTargetInputData,
  CreateLessonInputData,
  CreateQuizAttemptInputData,
  CreateQuizInputData,
  CreateResourcesInputData,
  CreateSectionInputData,
  EnrollCourseInputData,
  FinishQuizAttemptInputData,
  GiftCourseInputData,
  MarkLessonAsCompletedInputData,
  UpdateCourseInputData,
  UpdateCourseReviewInputData,
  UpdateCourseTargetInputData,
  UpdateLessonInputData,
  UpdateQuizInputData,
  //UpdateQuizInputData,
  UpdateSectionInputData,
} from "./courses.input"

import {
  createCategorySchema,
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
  constructor(private readonly coursesService: CoursesService) {}

  @ApiBearerAuth()
  @Post("create-course")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async createCourse(@AccountId() accountId: string) {
    return await this.coursesService.createCourse({
      accountId,
    })
  }

  // trang trí để cho swagger biết đây là api cần auth
  @ApiBearerAuth()
  @Patch("enroll-course")
  // cái route này xài JWT Guard, tức là nếu jwt hợp lệ thì qua cửa, còn không hợp lệ thì 401
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @Post("create-lesson")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async createLesson(
    @AccountId() accountId: string,
    @Body() data: CreateLessonInputData,
  ) {
    return this.coursesService.createLesson({
      accountId,
      data,
    })
  }

  @ApiBearerAuth()
  @Delete("delete-lesson/:lessonId")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async deleteLesson(
    @AccountId() accountId: string,
    @Param("lessonId") lessonId: string,
  ) {
    return this.coursesService.deleteLesson({
      accountId,
      data: { lessonId },
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
    @AccountId() accountId: string,
    @DataFromBody() data: CreateResourcesInputData,
    @UploadedFiles() { files }: Files,
  ) {
    return this.coursesService.createResources({
      accountId,
      data,
      files,
    })
  }

  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: createResourcesSchema })
  @Put("update-lesson")
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @Delete("delete-resource/:resourceId")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async deleteResource(
    @AccountId() accountId: string,
    @Param("resourceId") resourceId: string,
  ) {
    return this.coursesService.deleteResource({
      accountId,
      data: { resourceId },
    })
  }

  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: createCategorySchema })
  @Post("create-category")
  @UseGuards(JwtAuthGuard)
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
  @Delete("delete-category/:categoryId")
  @UseGuards(JwtAuthGuard)
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
  @Post("create-course-certificate")
  @UseGuards(JwtAuthGuard)
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
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: createQuizSchema })
  @Post("create-quiz")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor, FileFieldsInterceptor([{ name: "files" }]))
  async createQuiz(
    @AccountId() accountId: string,
    @DataFromBody() data: CreateQuizInputData,
    @UploadedFiles() { files }: Files,
  ) {
    return await this.coursesService.createQuiz({ accountId, data, files })
  }

  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: updateQuizSchema })
  @Put("update-quiz")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor, FileFieldsInterceptor([{ name: "files" }]))
  async updateQuiz(
    @AccountId() accountId: string,
    @DataFromBody() data: UpdateQuizInputData,
    @UploadedFiles() { files }: Files,
  ) {
    return await this.coursesService.updateQuiz({ accountId, data, files })
  }

  @ApiBearerAuth()
  @Post("mark-lesson-complete")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async markLessonComplete(
    @AccountId() accountId: string,
    @Body() data: MarkLessonAsCompletedInputData,
  ) {
    return await this.coursesService.markLessonAsCompleted({
      accountId,
      data,
    })
  }

  @ApiBearerAuth()
  @Post("create-quiz-attempt")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async createQuizAttempt(
    @AccountId() accountId: string,
    @Body() data: CreateQuizAttemptInputData,
  ) {
    return await this.coursesService.createQuizAttempt({ accountId, data })
  }

  @ApiBearerAuth()
  @Post("finish-quiz-attempt")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async finishQuizAttempt(
    @AccountId() accountId: string,
    @Body() data: FinishQuizAttemptInputData,
  ) {
    return await this.coursesService.finishQuizAttempt({ accountId, data })
  }

  @ApiBearerAuth()
  @Post("gift-course")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async giftCourse(
    @AccountId() accountId: string,
    @Body() data: GiftCourseInputData,
  ) {
    return await this.coursesService.giftCourse({ accountId, data })
  }
}
