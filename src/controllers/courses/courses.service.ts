import {
    CourseVerifyStatus,
    existKeyNotUndefined,
    NotificationType,
    OrderStatus,
    ProcessStatus,
    QuizAttemptStatus,
    ReportProcessStatus,
    SectionContentType,
    shuffleArray,
    SystemRoles,
    TransactionStatus,
    TransactionType,
    VideoType,
} from "@common"
import {
    AccountGradeMySqlEntity,
    AccountMySqlEntity,
    CategoryMySqlEntity,
    CertificateMySqlEntity,
    CompleteResourceMySqlEntity,
    CourseCategoryMySqlEntity,
    CourseMySqlEntity,
    CourseReviewMySqlEntity,
    CourseTargetMySqlEntity,
    EnrolledInfoMySqlEntity,
    LessonMySqlEntity,
    NotificationMySqlEntity,
    OrderCourseMySqlEntity,
    OrderMySqlEntity,
    ProgressMySqlEntity,
    QuizAttemptAnswerMySqlEntity,
    QuizAttemptMySqlEntity,
    QuizAttemptQuestionMySqlEntity,
    QuizMySqlEntity,
    QuizQuestionAnswerMySqlEntity,
    QuizQuestionMySqlEntity,
    ReportCourseMySqlEntity,
    ResourceAttachmentMySqlEntity,
    ResourceMySqlEntity,
    SectionContentMySqlEntity,
    SectionMySqlEntity,
    TransactionMySqlEntity,
} from "@database"
import { ConfigurationService, MailerService, StorageService } from "@global"
import {
    ConflictException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { ProcessMpegDashProducer } from "@workers"
import { getVideoDurationInSeconds } from "get-video-duration"
import { DataSource, DeepPartial, In, Repository } from "typeorm"
import {
    AddCourseAPInput,
    CreateCategoryInput,
    CreateCertificateInput,
    CreateCourseCategoriesInput,
    CreateCourseInput,
    CreateCourseReportInput,
    CreateCourseReviewInput,
    CreateCourseTargetInput,
    CreateQuizAttemptInput,
    CreateQuizQuestionAnswerInput,
    CreateQuizQuestionInput,
    CreateSectionContentInput,
    CreateSectionInput,
    DeleteAdminCourseInput,
    DeleteCategoryInput,
    DeleteCourseCategoryInput,
    DeleteCourseInput,
    DeleteCourseReviewInput,
    DeleteCourseTargetInput,
    DeleteQuizQuestionAnswerInput,
    DeleteQuizQuestionInput,
    DeleteResourceAttachmentInput,
    DeleteSectionContentInput,
    DeleteSectionInput,
    EnrollCourseInput,
    FinishQuizAttemptInput,
    MarkAsCompletedResourceInput,
    MarkContentAsCompletedInput,
    PublishCourseInput,
    ResolveCourseReportInput,
    UpdateCategoryInput,
    UpdateCourseInput,
    UpdateCourseReportInput,
    UpdateCourseReviewInput,
    UpdateCourseTargetInput,
    UpdateLessonInput,
    UpdateLessonProgressInput,
    UpdateQuizAttemptAnswersInput,
    UpdateQuizAttemptInput,
    UpdateQuizInput,
    UpdateQuizQuestionAnswerInput,
    UpdateQuizQuestionInput,
    UpdateResourceInput,
    UpdateSectionContentInput,
    UpdateSectionInput,
} from "./courses.input"
import {
    CreateCategoryOutput,
    CreateCertificateOutput,
    CreateCourseCategoriesOutput,
    CreateCourseOutput,
    CreateCourseReportOutput,
    CreateCourseReviewOutput,
    CreateCourseTargetOuput,
    CreateQuizAttemptOutput,
    CreateQuizQuestionAnswerOutput,
    CreateQuizQuestionOutput,
    CreateSectionContentOutput,
    CreateSectionOutput,
    DeleteAdminCourseOutput,
    DeleteCategoryOutput,
    DeleteCourseCategoryOutput,
    DeleteCourseOutput,
    DeleteCourseReviewOutput,
    DeleteCourseTargetOuput,
    DeleteQuizQuestionAnswerOutput,
    DeleteQuizQuestionOutput,
    DeleteResourceAttachmentOuput,
    DeleteSectionContentOutput,
    DeleteSectionOuput,
    EnrollCourseOutput,
    FinishQuizAttemptOutput,
    MarkAsCompletedResourceOutput,
    MarkContentAsCompletedOutput,
    PublishCourseOutput,
    ResolveCourseReportOutput,
    UpdateCategoryOutput,
    UpdateCourseOutput,
    UpdateCourseReportOutput,
    UpdateCourseReviewOutput,
    UpdateCourseTargetOuput,
    UpdateLessonOutput,
    UpdateLessonProgressOutput,
    UpdateQuizAttemptOutput,
    UpdateQuizOutput,
    UpdateQuizQuestionAnswerOutput,
    UpdateQuizQuestionOutput,
    UpdateResourceOutput,
    UpdateSectionContentOuput,
    UpdateSectionOuput,
} from "./courses.output"
import { appConfig } from "@config"
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager"
import numeral from "numeral"
import { v4 as uuidv4 } from "uuid"

@Injectable()
export class CoursesService {
    constructor(
    @InjectRepository(CourseMySqlEntity)
    private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
    @InjectRepository(SectionMySqlEntity)
    private readonly sectionMySqlRepository: Repository<SectionMySqlEntity>,
    @InjectRepository(SectionContentMySqlEntity)
    private readonly sectionContentMySqlRepository: Repository<SectionContentMySqlEntity>,
    @InjectRepository(LessonMySqlEntity)
    private readonly lessonMySqlRepository: Repository<LessonMySqlEntity>,
    @InjectRepository(CourseTargetMySqlEntity)
    private readonly courseTargetMySqlRepository: Repository<CourseTargetMySqlEntity>,
    @InjectRepository(ResourceMySqlEntity)
    private readonly resourceMySqlRepository: Repository<ResourceMySqlEntity>,
    @InjectRepository(ResourceAttachmentMySqlEntity)
    private readonly resourceAttachmentMySqlRepository: Repository<ResourceAttachmentMySqlEntity>,
    @InjectRepository(EnrolledInfoMySqlEntity)
    private readonly enrolledInfoMySqlRepository: Repository<EnrolledInfoMySqlEntity>,
    @InjectRepository(CategoryMySqlEntity)
    private readonly categoryMySqlRepository: Repository<CategoryMySqlEntity>,
    @InjectRepository(CourseCategoryMySqlEntity)
    private readonly courseCategoryMySqlRepository: Repository<CourseCategoryMySqlEntity>,
    @InjectRepository(CourseReviewMySqlEntity)
    private readonly courseReviewMySqlRepository: Repository<CourseReviewMySqlEntity>,
    @InjectRepository(CertificateMySqlEntity)
    private readonly courseCertificateMySqlEntity: Repository<CertificateMySqlEntity>,
    @InjectRepository(QuizMySqlEntity)
    private readonly quizMySqlRepository: Repository<QuizMySqlEntity>,
    @InjectRepository(QuizQuestionMySqlEntity)
    private readonly quizQuestionMySqlRepository: Repository<QuizQuestionMySqlEntity>,
    @InjectRepository(QuizQuestionAnswerMySqlEntity)
    private readonly quizQuestionAnswerMySqlRepository: Repository<QuizQuestionAnswerMySqlEntity>,
    @InjectRepository(ProgressMySqlEntity)
    private readonly progressMySqlRepository: Repository<ProgressMySqlEntity>,
    @InjectRepository(QuizAttemptMySqlEntity)
    private readonly quizAttemptMySqlRepository: Repository<QuizAttemptMySqlEntity>,
    @InjectRepository(QuizAttemptAnswerMySqlEntity)
    private readonly quizAttemptAnswerMySqlRepository: Repository<QuizAttemptAnswerMySqlEntity>,
    @InjectRepository(QuizAttemptQuestionMySqlEntity)
    private readonly quizAttemptQuestionMySqlRepository: Repository<QuizAttemptQuestionMySqlEntity>,
    @InjectRepository(AccountMySqlEntity)
    private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
    @InjectRepository(AccountGradeMySqlEntity)
    private readonly accountGradeMySqlRepository: Repository<AccountGradeMySqlEntity>,
    @InjectRepository(ReportCourseMySqlEntity)
    private readonly reportCourseMySqlRepository: Repository<ReportCourseMySqlEntity>,
    @InjectRepository(CompleteResourceMySqlEntity)
    private readonly completeResourceMySqlRepository: Repository<CompleteResourceMySqlEntity>,
    @InjectRepository(NotificationMySqlEntity)
    private readonly notificationMySqlRepository: Repository<NotificationMySqlEntity>,
    @InjectRepository(OrderMySqlEntity)
    private readonly orderMySqlRepository: Repository<OrderMySqlEntity>,
    @InjectRepository(OrderCourseMySqlEntity)
    private readonly orderCoursesMySqlRepository: Repository<OrderCourseMySqlEntity>,
    @InjectRepository(TransactionMySqlEntity)
    private readonly transactionMySqlEntity: Repository<TransactionMySqlEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly storageService: StorageService,
    private readonly mpegDashProcessorProducer: ProcessMpegDashProducer,
    private readonly dataSource: DataSource,
    private readonly mailerService: MailerService,
    private readonly configurationService: ConfigurationService,
    ) {}

    //ADD COURSE API FAST
    async addCourseAPI(input: AddCourseAPInput): Promise<string> {
        const { accountId, data } = input
        const { title, description, targets, courseOutline } = data

        const { courseId } = await this.courseMySqlRepository.save({
            creatorId: accountId,
            title,
            description,
            verifyStatus: CourseVerifyStatus.Pending,
        })

        // Save course targets concurrently
        await Promise.all(
            targets.map((target, index) =>
                this.courseTargetMySqlRepository.save({
                    courseId,
                    content: target,
                    position: index + 1,
                }),
            ),
        )

        // Iterate over course outline sections
        for (const [
            sectionIndex,
            { sectionName, sectionContents },
        ] of courseOutline.entries()) {
            const { sectionId } = await this.sectionMySqlRepository.save({
                courseId,
                title: sectionName,
                position: sectionIndex + 1,
            })

            // Save section contents concurrently
            await Promise.all(
                sectionContents.map(async (content, contentIndex) => {
                    const { title, type, description } = content

                    const { sectionContentId } =
            await this.sectionContentMySqlRepository.save({
                sectionId,
                type,
                title,
                position: contentIndex + 1,
            })

                    let contentData
                    switch (type) {
                    case SectionContentType.Lesson:
                        contentData = await this.lessonMySqlRepository.save({
                            lessonId: sectionContentId,
                            description,
                        })
                        break
                    case SectionContentType.Quiz:
                        contentData = await this.quizMySqlRepository.save({
                            quizId: sectionContentId,
                            description,
                        })
                        break
                    case SectionContentType.Resource:
                        contentData = await this.resourceMySqlRepository.save({
                            resourceId: sectionContentId,
                            description,
                        })
                        break
                    }

                    // Update the section content with the related entity
                    if (contentData) {
                        await this.sectionContentMySqlRepository.update(
                            { sectionContentId },
                            {
                                [`${type.toLowerCase()}Id`]:
                  contentData[`${type.toLowerCase()}Id`],
                                [type.toLowerCase()]: contentData,
                            },
                        )
                    }
                }),
            )
        }

        return "Added new course, open Management to check and edit"
    }

    //

    async enrollCourse(input: EnrollCourseInput): Promise<EnrollCourseOutput> {
        const { data, accountId } = input
        const { courseId } = data

        const account = await this.accountMySqlRepository.findOneBy({ accountId })

        const course = await this.courseMySqlRepository.findOne({
            where: {
                courseId,
            },
            relations: {
                sections: {
                    contents: true,
                },
            },
        })

        if (!course || course.isDeleted) {
            throw new NotFoundException("Course not found or has been deleted")
        }

        const {
            title,
            enableDiscount,
            discountPrice,
            price: coursePrice,
            duration,
            sections,
            creatorId,
        } = course

        if (accountId === creatorId) {
            throw new ConflictException("You cannot enroll to your created course.")
        }

        const enrollments = await this.enrolledInfoMySqlRepository.find({
            where: {
                accountId,
                courseId,
            },
        })

        const now = new Date()

        const enrolled = enrollments.some(
            (enrollment) => new Date(enrollment.endDate) > now,
        )

        if (enrolled) {
            throw new ConflictException("You are already enrolled in that course.")
        }

        const price = enableDiscount ? discountPrice : coursePrice
        const { instructor } =
      await this.configurationService.getConfiguration(courseId)
        const courseCreatorShares = (price * instructor) / 100

        const { username, balance } = account

        if (balance < price) {
            throw new ConflictException(
                "Your account does not have sufficient balance to enroll in this course.",
            )
        }

        await this.accountMySqlRepository.update(accountId, {
            balance: balance - price,
        })

        await this.accountMySqlRepository.increment(
            { accountId: creatorId },
            "balance",
            courseCreatorShares,
        )

        const enrollDate = new Date()
        const endDate = new Date(enrollDate)
        endDate.setMonth(endDate.getMonth() + duration)

        const { enrolledInfoId } = await this.enrolledInfoMySqlRepository.save({
            courseId,
            accountId,
            enrolled: true,
            priceAtEnrolled: price,
            endDate,
        })

        const gradedSectionIds = sections
            .flatMap((section) =>
                section.contents.some(
                    (content) => content.type === SectionContentType.Quiz,
                )
                    ? [section.sectionId]
                    : [],
            )
            .filter((sectionId) => sectionId !== undefined)

        const accountGrades = gradedSectionIds.map((sectionId) => ({
            enrolledInfoId,
            sectionId,
        }))

        await this.accountGradeMySqlRepository.save(accountGrades)
        const { orderId } = await this.orderMySqlRepository.save({
            accountId,
            orderStatus: OrderStatus.Completed,
            completeDate: new Date(),
        })

        await this.orderCoursesMySqlRepository.save({
            orderId,
            courseId,
            price: coursePrice,
            discountedPrice: enableDiscount ? coursePrice : discountPrice,
        })

        const notifications = [
            {
                senderId: accountId,
                receiverId: creatorId,
                title: "You have new enrollment to your course",
                type: NotificationType.Course,
                courseId,
                description: `User ${username} has enrolled to your course: ${title}`,
                referenceLink: `${appConfig().frontendUrl}/courses/${courseId}`,
            },
            {
                receiverId: creatorId,
                title: "You have new update on your balance!",
                type: NotificationType.Transaction,
                description: `You have received ${courseCreatorShares} STARCI(s)`,
            },
        ]

        await this.notificationMySqlRepository.save(notifications)

        const transactions: Array<DeepPartial<TransactionMySqlEntity>> = [
            {
                amountDepositedChange: -price,
                accountId,
                type: TransactionType.CheckOut,
                transactionDetails: [
                    {
                        courseId: course.courseId,
                        payAmount: price,
                        directIn: false,
                    },
                ],
            },
            {
                amountDepositedChange: price,
                accountId: creatorId,
                type: TransactionType.Received,
                transactionDetails: [
                    {
                        courseId: course.courseId,
                        payAmount: courseCreatorShares,
                        directIn: true,
                        accountId,
                    },
                ],
            },
        ]
        await this.transactionMySqlEntity.save(transactions)

        return {
            message: "Enrolled successfully",
            others: { enrolledInfoId },
        }
    }

    async createCourse(input: CreateCourseInput): Promise<CreateCourseOutput> {
        const { accountId } = input
        const created = await this.courseMySqlRepository.save({
            creatorId: accountId,
            title: "Untitled",
        })

        if (!created) {
            throw new ConflictException("Error while creating new course")
        }

        return {
            message: "Course " + created.title + "created Successfully",
            others: { courseId: created.courseId },
        }
    }

    async updateCourse(input: UpdateCourseInput): Promise<UpdateCourseOutput> {
        const { data, files } = input
        const {
            thumbnailIndex,
            previewVideoIndex,
            courseId,
            description,
            price,
            discountPrice,
            enableDiscount,
            title,
            receivedWalletAddress,
            categoryIds,
        } = data
        const course: DeepPartial<CourseMySqlEntity> = {
            courseId,
            description,
            title,
            price,
            discountPrice,
            enableDiscount,
            receivedWalletAddress,
        }

        const promises: Array<Promise<void>> = []

        const { previewVideoId, thumbnailId } =
      await this.courseMySqlRepository.findOneBy({ courseId })

        if (Number.isInteger(previewVideoIndex)) {
            const promise = async () => {
                const file = files.at(previewVideoIndex)
                if (previewVideoId) {
                    await this.storageService.update(previewVideoId, {
                        rootFile: file,
                    })
                } else {
                    const { assetId } = await this.storageService.upload({
                        rootFile: file,
                    })
                    course.previewVideoId = assetId
                }
            }
            promises.push(promise())
        }

        if (Number.isInteger(thumbnailIndex)) {
            const promise = async () => {
                const file = files.at(thumbnailIndex)
                if (thumbnailId) {
                    await this.storageService.update(thumbnailId, {
                        rootFile: file,
                    })
                } else {
                    const { assetId } = await this.storageService.upload({
                        rootFile: file,
                    })
                    course.thumbnailId = assetId
                }
            }
            promises.push(promise())
        }
        await Promise.all(promises)

        if (categoryIds?.length) {
            await this.courseCategoryMySqlRepository.delete({ courseId })
            const newCategories = categoryIds?.map((categoryId) => ({
                categoryId,
                courseId,
            }))
            await this.courseCategoryMySqlRepository.save(newCategories)
        }

        if (existKeyNotUndefined(course)) {
            await this.courseMySqlRepository.save(course)
        }

        return { message: "Course Updated Successfully" }
    }

    async createCourseReview(
        input: CreateCourseReviewInput,
    ): Promise<CreateCourseReviewOutput> {
        const { data, accountId } = input
        const { courseId, content, rating } = data

        const course = await this.courseMySqlRepository.findOneBy({ courseId })

        if (!course) {
            throw new NotFoundException("Course not found")
        }

        if (accountId === course.creatorId) {
            throw new ConflictException(
                "You cannot write a review on your created course.",
            )
        }

        const enrolled = await this.enrolledInfoMySqlRepository.findOne({
            where: {
                accountId,
            },
            relations: {
                account: true,
            },
        })

        if (!enrolled) {
            throw new ConflictException(
                "You must have been enrolled to the course to post a review",
            )
        }

        const reviewed = await this.courseReviewMySqlRepository.findOne({
            where: { accountId, courseId },
        })

        if (reviewed) {
            throw new ConflictException(
                "You have already has a review on this course",
            )
        }

        try {
            const result = await this.courseReviewMySqlRepository.save({
                courseId,
                accountId,
                content,
                rating,
            })

            if (result) {
                await this.notificationMySqlRepository.save({
                    senderId: accountId,
                    receiverId: course.creatorId,
                    title: `Your course : ${course.title} has received a review!`,
                    type: NotificationType.Course,
                    courseId,
                    description: `User ${enrolled.account.username} has wrote a ${rating} star(s) review on your course.`,
                    referenceLink: `${appConfig().frontendUrl}/courses/${courseId}`,
                })
                return { message: "Review Created Successfully" }
            }
        } catch (error) {
            throw new InternalServerErrorException("Failed due to system error")
        }
    }

    async updateCourseReview(
        input: UpdateCourseReviewInput,
    ): Promise<UpdateCourseReviewOutput> {
        const { data, accountId } = input
        const { content, rating, courseReviewId } = data

        const reviewed = await this.courseReviewMySqlRepository.findOne({
            where: { courseReviewId, accountId },
        })
        if (!reviewed) {
            throw new NotFoundException(
                "This review is not found or not owned by sender.",
            )
        }

        if (content || rating) {
            await this.courseReviewMySqlRepository.update(courseReviewId, {
                content,
                rating,
            })
            return { message: "Review Updated Successfully" }
        }
        return { message: "No update were made." }
    }

    async deleteCourseReview(
        input: DeleteCourseReviewInput,
    ): Promise<DeleteCourseReviewOutput> {
        const { data, accountId } = input
        const { courseReviewId } = data

        const reviewed = await this.courseReviewMySqlRepository.findOne({
            where: {
                courseReviewId,
                accountId,
            },
        })

        if (!reviewed) {
            // nó chỉ quăng lỗi khi mà cái review không tìm thấy hoặc nó không thuộc về người đó
            throw new NotFoundException(
                "This review is not found or not owned by sender.",
            )
        }

        await this.courseReviewMySqlRepository.delete({ courseReviewId })

        return { message: "Review deleted successfully" }
    }

    async createSection(input: CreateSectionInput): Promise<CreateSectionOutput> {
        const { data } = input
        const { courseId, title } = data

        const course = await this.courseMySqlRepository.findOneBy({
            courseId,
        })

        const maxSectionPosition = await this.sectionMySqlRepository.find({
            where: {
                courseId,
            },
            order: {
                position: "DESC",
            },
        })

        if (!course) throw new NotFoundException("Course not found.")
        const created = await this.sectionMySqlRepository.save({
            courseId,
            title,
            position: maxSectionPosition.length
                ? maxSectionPosition[0].position + 1
                : 1,
        })

        return {
            message: `A section with id ${created.sectionId} has been created successfully.`,
        }
    }

    async createSectionContent(
        input: CreateSectionContentInput,
    ): Promise<CreateSectionContentOutput> {
        const { sectionId, type } = input.data

        const sectionContents = await this.sectionContentMySqlRepository.find({
            where: {
                sectionId,
            },
        })

        const position = sectionContents.reduce((max, current) => {
            return current.position > max ? current.position : max
        }, 0)

        const { sectionContentId } = await this.sectionContentMySqlRepository.save({
            type,
            sectionId,
            title: "Untitled",
            position: position + 1,
        })

        switch (type) {
        case SectionContentType.Lesson: {
            const lesson = await this.lessonMySqlRepository.save({
                lessonId: sectionContentId,
                description: "Write some description here.",
            })
            await this.sectionContentMySqlRepository.update(
                {
                    sectionContentId,
                },
                {
                    lessonId: lesson.lessonId,
                    lesson,
                },
            )
            break
        }
        case SectionContentType.Quiz: {
            const quiz = await this.quizMySqlRepository.save({
                quizId: sectionContentId,
            })
            await this.sectionContentMySqlRepository.update(
                {
                    sectionContentId,
                },
                {
                    quizId: quiz.quizId,
                    quiz,
                },
            )
            break
        }
        case SectionContentType.Resource: {
            const resource = await this.resourceMySqlRepository.save({
                resourceId: sectionContentId,
                description: "Write some description here.",
            })
            await this.sectionContentMySqlRepository.update(sectionContentId, {
                resourceId: resource.resourceId,
                resource,
            })
            break
        }
        }

        return {
            message: "Content created successfully.",
        }
    }

    async updateSectionContent(
        input: UpdateSectionContentInput,
    ): Promise<UpdateSectionContentOuput> {
        const { data } = input
        const { sectionContentId, title } = data

        const content = await this.sectionContentMySqlRepository.findOneBy({
            sectionContentId,
        })

        if (!content) {
            throw new NotFoundException("Section Content not found")
        }

        await this.sectionContentMySqlRepository.update(sectionContentId, {
            title,
        })

        return {
            message: "Section Content has been updated successfully.",
        }
    }

    async updateLesson(input: UpdateLessonInput): Promise<UpdateLessonOutput> {
        const { data, files } = input
        const {
            lessonId,
            description,
            lessonVideoIndex,
            thumbnailIndex,
            title,
            isTrial,
        } = data

        const { thumbnailId, lessonVideoId } =
      await this.lessonMySqlRepository.findOneBy({ lessonId })

        const promises: Array<Promise<void>> = []

        const lesson: DeepPartial<LessonMySqlEntity> = { description, isTrial }

        if (Number.isInteger(lessonVideoIndex)) {
            const promise = async () => {
                const file = files.at(lessonVideoIndex)

                await this.lessonMySqlRepository.update(
                    { lessonId },
                    {
                        processStatus: ProcessStatus.Pending,
                    },
                )

                const queryAtStart = this.lessonMySqlRepository
                    .createQueryBuilder()
                    .update()
                    .set({
                        processStatus: ProcessStatus.Processing,
                        videoType: VideoType.MP4,
                    })
                    .where({
                        lessonId,
                    })
                    .getQueryAndParameters()

                const queryAtEnd = this.lessonMySqlRepository
                    .createQueryBuilder()
                    .update()
                    .set({
                        processStatus: ProcessStatus.Completed,
                        videoType: VideoType.DASH,
                    })
                    .andWhere({
                        lessonId,
                    })
                    .getQueryAndParameters()

                let assetId: string
                if (lessonVideoId) {
                    await this.storageService.update(lessonVideoId, {
                        rootFile: file,
                    })
                    assetId = lessonVideoId
                } else {
                    const { assetId: createdAssetId } = await this.storageService.upload({
                        rootFile: file,
                    })
                    lesson.lessonVideoId = createdAssetId
                    assetId = createdAssetId
                }

                const readStream = await this.storageService.createReadStream(assetId)
                const durationInSeconds = await getVideoDurationInSeconds(readStream)

                await this.lessonMySqlRepository.update(lessonId, {
                    durationInSeconds,
                })

                await this.mpegDashProcessorProducer.add({
                    assetId,
                    file,
                    callbackQueries: {
                        queryAtStart,
                        queryAtEnd,
                    },
                })
            }
            promises.push(promise())
        }

        if (Number.isInteger(thumbnailIndex)) {
            const promise = async () => {
                const file = files.at(thumbnailIndex)
                if (thumbnailId) {
                    await this.storageService.update(thumbnailId, {
                        rootFile: file,
                    })
                } else {
                    const { assetId } = await this.storageService.upload({
                        rootFile: file,
                    })
                    lesson.thumbnailId = assetId
                }
            }
            promises.push(promise())
        }
        await Promise.all(promises)

        if (existKeyNotUndefined(lesson))
            await this.lessonMySqlRepository.update(lessonId, lesson)
        await this.sectionContentMySqlRepository.update(lessonId, {
            title,
        })
        return {
            message: "Update lesson successfully.",
        }
    }

    async deleteSectionContent(
        input: DeleteSectionContentInput,
    ): Promise<DeleteSectionContentOutput> {
        const { data } = input
        const { sectionContentId } = data

        const sectionContent = await this.sectionContentMySqlRepository.findOneBy({
            sectionContentId,
        })

        if (!sectionContent) {
            throw new NotFoundException("Content not found")
        }

        switch (sectionContent.type) {
        case SectionContentType.Lesson: {
            const lesson = await this.lessonMySqlRepository.findOneBy({
                lessonId: sectionContentId,
            })
            if (lesson) {
                if (lesson.thumbnailId || lesson.lessonVideoId) {
                    const lessonMedia = [lesson.thumbnailId, lesson.lessonVideoId]
                    await this.storageService.delete(...lessonMedia)
                }
            }
            await this.lessonMySqlRepository.delete({ lessonId: sectionContentId })
            break
        }
        case SectionContentType.Quiz: {
            await this.quizMySqlRepository.delete({ quizId: sectionContentId })
            break
        }
        case SectionContentType.Resource: {
            const attachments = await this.resourceAttachmentMySqlRepository.findBy(
                { resourceId: sectionContentId },
            )
            if (attachments) {
                const mediaIds = attachments.map(({ fileId }) => fileId)
                await this.storageService.delete(...mediaIds)
            }
            await this.resourceMySqlRepository.delete({
                resourceId: sectionContentId,
            })
            break
        }
        default:
            break
        }

        await this.sectionContentMySqlRepository.delete({ sectionContentId })
        return {
            message: "Content has been deleted successfully.",
        }
    }

    async createCourseTarget(
        input: CreateCourseTargetInput,
    ): Promise<CreateCourseTargetOuput> {
        const { data } = input
        const { content, courseId } = data

        const maxResult = await this.courseTargetMySqlRepository.count({
            where: {
                courseId,
            },
        })

        const created = await this.courseTargetMySqlRepository.save({
            courseId,
            content,
            position: maxResult + 1,
        })
        if (created)
            return {
                message: `A course target with id ${created.courseTargetId} has been created successfully.`,
            }
    }

    async updateCourseTarget(
        input: UpdateCourseTargetInput,
    ): Promise<UpdateCourseTargetOuput> {
        const { data } = input
        const { content, courseTargetId } = data
        await this.courseTargetMySqlRepository.update(courseTargetId, {
            content,
        })
        return {
            message: `A course target with id ${courseTargetId} has been updated successfully.`,
        }
    }

    async deleteCourseTarget(
        input: DeleteCourseTargetInput,
    ): Promise<DeleteCourseTargetOuput> {
        const { data } = input
        const { courseTargetId } = data
        await this.courseTargetMySqlRepository.delete({ courseTargetId })
        return {
            message: `A course target with id ${courseTargetId} has been deleted successfully.`,
        }
    }

    async updateResource(
        input: UpdateResourceInput,
    ): Promise<UpdateResourceOutput> {
        const { files, data } = input
        const { resourceId, description, title } = data

        const resource = await this.resourceMySqlRepository.findOne({
            where: {
                resourceId,
            },
            relations: {
                attachments: true,
            },
        })

        resource.description = description
        const attachments = resource.attachments

        if (files) {
            const promises: Array<Promise<void>> = []
            for (const file of files) {
                const promise = async () => {
                    const { assetId } = await this.storageService.upload({
                        rootFile: file,
                    })
                    attachments.push({
                        resourceId,
                        name: file.originalname,
                        fileId: assetId,
                    } as ResourceAttachmentMySqlEntity)
                }
                promises.push(promise())
            }
            await Promise.all(promises)
        }

        resource.attachments = attachments

        await this.resourceMySqlRepository.save(resource)
        await this.sectionContentMySqlRepository.update(resourceId, {
            title,
        })

        return {
            message: "Resource updated sucessfully",
        }
    }

    async updateSection(input: UpdateSectionInput): Promise<UpdateSectionOuput> {
        const { data } = input
        const { sectionId, title, position } = data
        await this.sectionMySqlRepository.update(sectionId, {
            title,
            position,
        })
        return {
            message: "Section has been updated successfully.",
        }
    }

    async deleteSection(input: DeleteSectionInput): Promise<DeleteSectionOuput> {
        const { data } = input
        const { sectionId } = data
        await this.sectionMySqlRepository.delete({ sectionId })
        return {
            message: "Section has been deleted successfully.",
        }
    }

    async deleteResourceAttachment(
        input: DeleteResourceAttachmentInput,
    ): Promise<DeleteResourceAttachmentOuput> {
        const { data } = input
        const { resourceAttachmentId } = data

        const attachment = await this.resourceAttachmentMySqlRepository.findOneBy({
            resourceAttachmentId,
        })

        if (!attachment) {
            throw new NotFoundException("Resource not found")
        }

        await this.storageService.delete(attachment.fileId)
        await this.resourceAttachmentMySqlRepository.delete({
            resourceAttachmentId,
        })

        return {
            message: "Attachment has been deleted successfully.",
        }
    }

    //apis only
    async createCategory(
        input: CreateCategoryInput,
    ): Promise<CreateCategoryOutput> {
        const { data, files } = input
        const { name, categoryParentIds, categoryIds, imageIndex } = data

        let imageId: string | undefined

        if (Number.isInteger(imageIndex)) {
            const { assetId } = await this.storageService.upload({
                rootFile: files.at(imageIndex),
            })
            imageId = assetId
        }

        let level = 0

        let parentLevels: number[] = []
        if (categoryParentIds && categoryParentIds.length > 0) {
            const parentCategories = await this.categoryMySqlRepository.find({
                where: {
                    categoryId: In(categoryParentIds),
                },
            })
            parentLevels = parentCategories.map((category) => category.level)

            if (new Set(parentLevels).size !== 1) {
                throw new ConflictException(
                    "All parent categories must be at the same level",
                )
            }
            level = parentLevels[0] + 1
        }

        let childLevels: number[] = []
        if (categoryIds && categoryIds.length > 0) {
            const childCategories = await this.categoryMySqlRepository.find({
                where: {
                    categoryId: In(categoryIds),
                },
            })
            childLevels = childCategories.map((category) => category.level)

            if (new Set(childLevels).size !== 1) {
                throw new ConflictException(
                    "All child categories must be at the same level",
                )
            }

            if (!categoryParentIds) {
                if (childLevels[0] !== 1) {
                    throw new ConflictException("Child categories must be at level 1")
                }
                level = 0
            }
        }

        if (categoryParentIds && categoryIds) {
            if (childLevels[0] - parentLevels[0] !== 2) {
                throw new ConflictException(
                    "The level difference between child and parent categories must be 2",
                )
            }
            const found = await this.categoryMySqlRepository.find({
                where: {
                    level,
                },
            })

            if (found.some((categoryName) => categoryName.name === name)) {
                throw new ConflictException(
                    `There's already existed category named ${name} at this level`,
                )
            }
        }

        const createdCategory = await this.categoryMySqlRepository.save({
            name,
            imageId,
            level,
            categoryParentRelations: categoryIds
                ? categoryIds.map((categoryId) => ({
                    categoryId,
                }))
                : [],
            categoryRelations: categoryParentIds
                ? categoryParentIds.map((categoryParentId) => ({
                    categoryParentId,
                }))
                : [],
        })

        return {
            message: `Category ${createdCategory.name} has been created successfully`,
            others: { categoryId: createdCategory.categoryId },
        }
    }

    async updateCategory(
        input: UpdateCategoryInput,
    ): Promise<UpdateCategoryOutput> {
        const { data, files } = input
        const { categoryId, name, imageIndex } = data

        const category = await this.categoryMySqlRepository.findOneBy({
            categoryId,
        })

        if (!category) {
            throw new NotFoundException("Category not found or has been deleted.")
        }

        let imageId: string | undefined

        if (files) {
            if (Number.isInteger(imageIndex)) {
                if (category.imageId) {
                    await this.storageService.delete(category.imageId)
                }
                const { assetId } = await this.storageService.upload({
                    rootFile: files.at(imageIndex),
                })
                imageId = assetId
            }
        }

        await this.categoryMySqlRepository.update(categoryId, {
            imageId,
            name,
        })

        return {
            message: `Category : ${category.name} has been updated successfully.`,
        }
    }

    async deleteCategory(
        input: DeleteCategoryInput,
    ): Promise<DeleteCategoryOutput> {
        const { data } = input
        const { categoryId } = data

        await this.categoryMySqlRepository.delete({
            categoryId,
        })

        return {
            message: `Category ${categoryId} has been deleted successfully`,
        }
    }

    async createCourseCategories(
        input: CreateCourseCategoriesInput,
    ): Promise<CreateCourseCategoriesOutput> {
        const { data } = input
        const { courseId, categoryIds } = data

        const courseCategories = categoryIds.map((categoryId) => ({
            courseId,
            categoryId,
        }))

        //await this.courseCategoryMySqlRepository.save(courseCategories);
        await this.courseCategoryMySqlRepository.save(courseCategories)

        return {
            message: "Course Category has been created successfully",
        }
    }

    async deleteCourseCategory(
        input: DeleteCourseCategoryInput,
    ): Promise<DeleteCourseCategoryOutput> {
        const { data } = input
        const { categoryId, courseId } = data

        const found = await this.courseCategoryMySqlRepository.findOne({
            where: {
                courseId,
                categoryId,
            },
        })

        if (!found)
            throw new NotFoundException("No specified course found in this category")

        await this.courseCategoryMySqlRepository.delete({
            categoryId,
            courseId,
        })

        return {
            message: "Course has been deleted from category successfully",
        }
    }

    async createCourseCertificate(
        input: CreateCertificateInput,
    ): Promise<CreateCertificateOutput> {
        const { accountId, data } = input
        const { courseId } = data

        const enrollments = await this.enrolledInfoMySqlRepository.find({
            where: {
                accountId,
                courseId,
            },
        })

        if (!enrollments) {
            throw new ConflictException("You haven't enrolled to the course")
        }

        const now = new Date()

        const activeEnrollment = enrollments.find(
            (enrollment) => new Date(enrollment.endDate) > now,
        )

        if (!activeEnrollment) {
            throw new NotFoundException(
                "You do not have any active enrollments in this course that remain valid. ",
            )
        }

        const found = await this.courseCertificateMySqlEntity.findOne({
            where: {
                accountId,
                courseId,
            },
        })

        if (found) {
            throw new ConflictException(
                "You have already get certificate of this course",
            )
        }

        const { balance } = await this.accountMySqlRepository.findOne({
            where: {
                accountId,
            },
        })

        const { completed } =
      await this.configurationService.getConfiguration(courseId)
        const earnAmount = (completed / 100) * activeEnrollment.priceAtEnrolled

        await this.accountMySqlRepository.update(accountId, {
            balance: balance + earnAmount,
        })

        const achievedDate = new Date()
        const expiredDate = new Date(achievedDate)
        expiredDate.setDate(expiredDate.getDate() + 90)

        const { certificateId } = await this.courseCertificateMySqlEntity.save({
            accountId,
            courseId,
            achievedDate,
            expiredDate,
        })

        const { title } = await this.courseMySqlRepository.findOneBy({ courseId })

        await this.notificationMySqlRepository.save({
            receiverId: accountId,
            title: "You have received a certificate!",
            type: NotificationType.Certificate,
            courseId,
            description: `You have been received a certificate for your completion on the course: ${title} `,
            referenceLink: `/certificate/${certificateId}`,
        })

        await this.notificationMySqlRepository.save({
            receiverId: accountId,
            title: "You have new update on your balance!",
            type: NotificationType.Transaction,
            description: `You have received ${numeral(earnAmount).format("0.00")} STARCI(s)`,
        })

        await this.transactionMySqlEntity.save({
            amountDepositedChange: earnAmount,
            accountId,
            courseId,
            preTextEarn: "Complete the course ",
            transactionDetails: [
                {
                    courseId,
                },
            ],
            type: TransactionType.Earn,
            status: TransactionStatus.Success,
        })

        return {
            message: "Certificate created successfully",
            others: {
                certificateId,
            },
        }
    }

    async updateQuiz(input: UpdateQuizInput): Promise<UpdateQuizOutput> {
        const { data } = input
        const { quizId, passingPercent, timeLimit, title, description } = data

        const activeAttempts = await this.quizAttemptMySqlRepository.findOneBy({
            quizId,
            attemptStatus: QuizAttemptStatus.Started,
        })

        if (activeAttempts) {
            throw new ConflictException(
                "You cannot apply changes to the quiz content while learners are currently taking it.",
            )
        }

        await this.quizMySqlRepository.update(quizId, {
            passingPercent,
            timeLimit,
            description,
        })

        await this.sectionContentMySqlRepository.update(quizId, {
            title,
        })

        // const numberOfQuizQuestions = await this.quizQuestionMySqlRepository.find({
        //     where: {
        //         quizId
        //     },
        //     relations: {
        //         answers: true
        //     }
        // })

        // if (numberOfQuizQuestions && numberOfQuizQuestions.length < 2) {
        //     throw new ConflictException("Please provide at least 2 questions for the quiz")
        // }

        // numberOfQuizQuestions.forEach(question => {
        //     if (question.answers.length < 2) {
        //         throw new ConflictException(`Question: ${question.question} must have at least 2 answers.`)
        //     }

        //     const hasCorrectAnswer = question.answers.some(answer => answer.isCorrect === true)
        //     if (!hasCorrectAnswer) {
        //         throw new ConflictException(`Question: ${question.question} must have at least 1 correct answer.`)
        //     }
        // })

        // if (passingScore || timeLimit) {
        //     await this.quizMySqlRepository.update(quizId, { passingScore, timeLimit })
        // }

        return {
            message: "Quiz updated successfully",
        }
    }

    async createQuizQuestion(
        input: CreateQuizQuestionInput,
    ): Promise<CreateQuizQuestionOutput> {
        const { data } = input
        const { quizId } = data

        const activeAttempts = await this.quizAttemptMySqlRepository.findOneBy({
            quizId,
            attemptStatus: QuizAttemptStatus.Started,
        })

        if (activeAttempts) {
            throw new ConflictException(
                "You cannot apply changes to the quiz content while learners are currently taking it.",
            )
        }

        const quiz = await this.quizMySqlRepository.findOneBy({ quizId })

        if (!quiz) {
            throw new NotFoundException("Quiz Not Found.")
        }

        const questions = await this.quizQuestionMySqlRepository.find({
            where: {
                quizId,
            },
            order: {
                position: "DESC",
            },
        })

        await this.quizQuestionMySqlRepository.save({
            quizId,
            question: "Is this a question?",
            position: questions.length ? questions[0].position + 1 : 1,
            answers: [
                {
                    isCorrect: true,
                    content: `This is a correct anwser ${uuidv4()}.`,
                    position: 1,
                },
                {
                    isCorrect: false,
                    content: `This is a wrong anwser ${uuidv4()}.`,
                    position: 2,
                },
            ],
        })

        return {
            message: "Quiz's question has been created successfully.",
        }
    }

    async updateQuizQuestion(
        input: UpdateQuizQuestionInput,
    ): Promise<UpdateQuizQuestionOutput> {
        const { data, files } = input
        const {
            quizQuestionId,
            question,
            point,
            swapPosition,
            questionMedia,
            deleteMedia,
        } = data

        console.log(point)

        const quizQuestion = await this.quizQuestionMySqlRepository.findOneBy({
            quizQuestionId,
        })

        if (!quizQuestion) {
            throw new NotFoundException("Quiz Question Not Found.")
        }

        const activeAttempts = await this.quizAttemptMySqlRepository.findOneBy({
            quizId: quizQuestion.quizId,
            attemptStatus: QuizAttemptStatus.Started,
        })

        if (activeAttempts) {
            throw new ConflictException(
                "You cannot apply changes to the quiz content while learners are currently taking it.",
            )
        }

        if (files) {
            const { mediaIndex, mediaType } = questionMedia
            const file = files.at(mediaIndex)

            if (quizQuestion.mediaId) {
                await this.storageService.delete(quizQuestion.mediaId)
            }

            const { assetId } = await this.storageService.upload({
                rootFile: file,
            })

            await this.quizQuestionMySqlRepository.update(
                { quizQuestionId },
                {
                    mediaId: assetId,
                    mediaType,
                },
            )
        }

        if (deleteMedia) {
            await this.storageService.delete(quizQuestion.mediaId)
            await this.quizQuestionMySqlRepository.update(
                { quizQuestionId: quizQuestion.quizQuestionId },
                { mediaId: null, mediaType: null },
            )
        }

        let tempPosition: number
        if (swapPosition !== undefined) {
            const targetQuestion = await this.quizQuestionMySqlRepository.findOne({
                where: {
                    quizId: quizQuestion.quizId,
                    position: swapPosition,
                },
            })

            tempPosition = swapPosition

            await this.quizQuestionMySqlRepository.update(
                targetQuestion.quizQuestionId,
                {
                    position: quizQuestion.position,
                },
            )
        }

        await this.quizQuestionMySqlRepository.update(quizQuestionId, {
            question,
            point,
            position: tempPosition,
        })

        return {
            message: "Quiz's question has been updated successfully.",
        }
    }

    async deleteQuizQuestion(
        input: DeleteQuizQuestionInput,
    ): Promise<DeleteQuizQuestionOutput> {
        const { data } = input
        const { quizQuestionId } = data

        const question = await this.quizQuestionMySqlRepository.findOneBy({
            quizQuestionId,
        })

        if (!question) {
            throw new NotFoundException("Quiz question not found")
        }

        const activeAttempts = await this.quizAttemptMySqlRepository.findOneBy({
            quizId: question.quizId,
            attemptStatus: QuizAttemptStatus.Started,
        })

        if (activeAttempts) {
            throw new ConflictException(
                "You cannot apply changes to the quiz content while learners are currently taking it.",
            )
        }

        const { position, quizId } = question

        const { questions } = await this.quizMySqlRepository.findOne({
            where: {
                quizId,
            },
            relations: {
                questions: true,
            },
        })

        if (!questions || questions.length - 1 < 1) {
            throw new ConflictException("Quiz must have at least 1 question(s)")
        }

        await this.quizQuestionMySqlRepository.delete({ quizQuestionId })

        await this.quizQuestionMySqlRepository
            .createQueryBuilder()
            .update()
            .set({ position: () => "position - 1" })
            .where("position > :position", { position })
            .execute()

        return { message: "Question deleted successfully" }
    }

    async createQuizQuestionAnswer(
        input: CreateQuizQuestionAnswerInput,
    ): Promise<CreateQuizQuestionAnswerOutput> {
        const { data } = input
        const { quizQuestionId } = data

        const question = await this.quizQuestionMySqlRepository.findOneBy({
            quizQuestionId,
        })

        if (!question) {
            throw new NotFoundException("Question not found")
        }

        const activeAttempts = await this.quizAttemptMySqlRepository.findOneBy({
            quizId: question.quizId,
            attemptStatus: QuizAttemptStatus.Started,
        })

        if (activeAttempts) {
            throw new ConflictException(
                "You cannot apply changes to the quiz content while learners are currently taking it.",
            )
        }

        const answers = await this.quizQuestionAnswerMySqlRepository.find({
            where: {
                quizQuestionId,
            },
            order: {
                position: "DESC",
            },
        })

        const hasTrueAnwser = !!answers.find(({ isCorrect }) => isCorrect)

        await this.quizQuestionAnswerMySqlRepository.save({
            content: hasTrueAnwser
                ? `This is a wrong awnser ${uuidv4()}.`
                : `This is a correct awnser ${uuidv4()}.`,
            quizQuestionId,
            isCorrect: !hasTrueAnwser,
            position: answers.length ? answers[0].position + 1 : 1,
        })

        return {
            message: "Answer to question has been created successfully.",
        }
    }

    async updateQuizQuestionAnswer(
        input: UpdateQuizQuestionAnswerInput,
    ): Promise<UpdateQuizQuestionAnswerOutput> {
        const { data } = input
        const {
            quizQuestionAnswerId,
            content,
            isCorrect,
            lastAnswer,
            swapPosition,
        } = data

        const answer = await this.quizQuestionAnswerMySqlRepository.findOne({
            where: {
                quizQuestionAnswerId,
            },
            relations: {
                quizQuestion: true,
            },
        })

        if (!answer) {
            throw new NotFoundException("Quiz Question Not Found.")
        }

        if (isCorrect === false) {
            const numCorrects = await this.quizQuestionAnswerMySqlRepository.count({
                where: {
                    isCorrect: true,
                    quizQuestionId: answer.quizQuestionId,
                },
            })
            if (numCorrects < 1) {
                throw new ConflictException("Must have at least one correct answers")
            }
        }

        let tempPosition: number

        if (swapPosition !== undefined) {
            const targetAnswer = await this.quizQuestionAnswerMySqlRepository.findOne(
                {
                    where: {
                        quizQuestionId: answer.quizQuestionId,
                        position: swapPosition,
                    },
                },
            )

            tempPosition = swapPosition

            await this.quizQuestionAnswerMySqlRepository.update(
                targetAnswer.quizQuestionAnswerId,
                {
                    position: answer.position,
                },
            )
        }

        if (lastAnswer !== undefined) {
            const previousLastAnswer =
        await this.quizQuestionAnswerMySqlRepository.findOne({
            where: {
                lastAnswer,
            },
        })
            if (previousLastAnswer) {
                await this.quizQuestionAnswerMySqlRepository.update(
                    previousLastAnswer.quizQuestionAnswerId,
                    {
                        lastAnswer: false,
                    },
                )
            }
        }

        const activeAttempts = await this.quizAttemptMySqlRepository.findOneBy({
            quizId: answer.quizQuestion.quizId,
            attemptStatus: QuizAttemptStatus.Started,
        })

        if (activeAttempts) {
            throw new ConflictException(
                "You cannot apply changes to the quiz content while learners are currently taking it.",
            )
        }

        await this.quizQuestionAnswerMySqlRepository.update(quizQuestionAnswerId, {
            content,
            isCorrect,
            lastAnswer,
            position: tempPosition,
        })

        return {
            message: "Quiz's question has been updated successfully.",
        }
    }

    async deleteQuizQuestionAnswer(
        input: DeleteQuizQuestionAnswerInput,
    ): Promise<DeleteQuizQuestionAnswerOutput> {
        const { data } = input
        const { quizQuestionAnswerId } = data

        const answer = await this.quizQuestionAnswerMySqlRepository.findOne({
            where: {
                quizQuestionAnswerId,
            },
            relations: {
                quizQuestion: true,
            },
        })

        if (!answer) {
            throw new NotFoundException("Answer not found")
        }

        const activeAttempts = await this.quizAttemptMySqlRepository.findOneBy({
            quizId: answer.quizQuestion.quizId,
            attemptStatus: QuizAttemptStatus.Started,
        })

        if (activeAttempts) {
            throw new ConflictException(
                "You cannot apply changes to the quiz content while learners are currently taking it.",
            )
        }

        const { position, quizQuestionId, isCorrect } = answer

        const { answers } = await this.quizQuestionMySqlRepository.findOne({
            where: {
                quizQuestionId,
            },
            relations: {
                answers: true,
            },
        })

        if (!answers || answers.length - 1 < 2) {
            throw new ConflictException("Quiz question must have at least 2 answers")
        }

        await this.quizQuestionAnswerMySqlRepository.delete({
            quizQuestionAnswerId,
        })

        await this.quizQuestionAnswerMySqlRepository
            .createQueryBuilder()
            .update()
            .set({ position: () => "position - 1" })
            .where("position > :position", { position })
            .execute()

        if (isCorrect) {
            await this.quizQuestionAnswerMySqlRepository
                .createQueryBuilder()
                .update()
                .set({ isCorrect: true })
                .where("position = :position", { position })
                .execute()
        }
        return { message: "Answer deleted successfully" }
    }

    async markContentAsCompleted(
        input: MarkContentAsCompletedInput,
    ): Promise<MarkContentAsCompletedOutput> {
        const { data } = input
        const { sectionContentId } = data

        console.log(sectionContentId)
        // const progress = await this.progressMySqlRepository.findOne({
        //     where: { sectionContentId },
        //     relations: { enrolledInfo: true },
        // })

        // if (!progress) {
        //     throw new NotFoundException("Content not found")
        // }

        // const { enrolledInfo } = progress

        // if (!enrolledInfo || enrolledInfo.accountId !== accountId) {
        //     throw new NotFoundException(
        //         "You haven't enrolled to course that has this content",
        //     )
        // }

        // const now = new Date()

        // if (now > enrolledInfo.endDate)
        //     throw new ConflictException("This Course has expired")

        // await this.progressMySqlRepository.update(
        //     { sectionContentId },
        //     { completeState: CompleteState.Completed },
        // )

        // await queryRunner.commitTransaction()

        return { message: "You have completed this content" }
    }

    async createQuizAttempt(
        input: CreateQuizAttemptInput,
    ): Promise<CreateQuizAttemptOutput> {
        const { data, accountId } = input
        const { quizId } = data

        const attempt = await this.quizAttemptMySqlRepository.findOne({
            where: {
                attemptStatus: QuizAttemptStatus.Started,
                accountId,
                quizId,
            },
        })

        if (attempt) {
            throw new ConflictException("An attempt has been started.")
        }

        const quiz = await this.quizMySqlRepository.findOne({
            where: {
                quizId,
            },
            relations: {
                questions: {
                    answers: true,
                },
            },
        })

        const { timeLimit } = await this.quizMySqlRepository.findOne({
            where: {
                quizId,
            },
        })

        const { quizAttemptId } = await this.quizAttemptMySqlRepository.save({
            accountId,
            quizId,
            timeLeft: timeLimit,
            observedAt: new Date(),
            timeLimitAtStart: timeLimit,
        })

        const questions: Array<DeepPartial<QuizQuestionMySqlEntity>> = shuffleArray(
            quiz.questions.map(({ answers, quizQuestionId, position }) => ({
                quizQuestionId,
                position,
                answers: shuffleArray(
                    answers.map(({ quizQuestionAnswerId, position }) => ({
                        quizQuestionAnswerId,
                        position,
                    })),
                ),
            })),
        )

        await this.cacheManager.set(quizAttemptId, questions, 0)

        return {
            message: "Attempt Started Successfully!",
            others: {
                quizAttemptId,
            },
        }
    }

    async finishQuizAttempt(
        input: FinishQuizAttemptInput,
    ): Promise<FinishQuizAttemptOutput> {
        const { data } = input
        const { quizAttemptId } = data

        const attempt = await this.quizAttemptMySqlRepository.findOne({
            where: {
                quizAttemptId,
            },
            relations: {
                attemptAnswers: {
                    quizQuestionAnswer: true,
                },
                quiz: {
                    questions: {
                        answers: true,
                    },
                },
            },
        })

        if (!attempt) {
            throw new NotFoundException("Attempt not found")
        }

        if (attempt.attemptStatus === QuizAttemptStatus.Ended) {
            throw new NotFoundException("Attempt already ended")
        }

        const { attemptAnswers, quiz, timeLeft, timeLimitAtStart } = attempt
        const { questions } = quiz

        let receivedPoints = 0

        for (const { answers, point } of questions) {
            const correctAnswers = answers.filter(({ isCorrect }) => isCorrect)
            if (!correctAnswers.length) {
                receivedPoints += point
                continue
            }
            const pointEachCorrectAnswer = point / correctAnswers.length
            const attemptAnswersInThisQuestion = attemptAnswers.filter(
                ({ quizQuestionAnswerId }) =>
                    answers
                        .map(({ quizQuestionAnswerId }) => quizQuestionAnswerId)
                        .includes(quizQuestionAnswerId),
            )
            if (attemptAnswersInThisQuestion.length > correctAnswers.length) continue
            for (const { quizQuestionAnswerId } of attemptAnswersInThisQuestion) {
                if (
                    correctAnswers
                        .map(({ quizQuestionAnswerId }) => quizQuestionAnswerId)
                        .includes(quizQuestionAnswerId)
                ) {
                    receivedPoints += pointEachCorrectAnswer
                }
            }
        }

        const totalPoints = questions.reduce((accumulator, { point }) => {
            return accumulator + point
        }, 0)

        const receivedPercent = (receivedPoints / totalPoints) * 100
        const isPassed = receivedPercent >= quiz.passingPercent
        const timeTaken = timeLimitAtStart - timeLeft

        await this.quizAttemptMySqlRepository.update(quizAttemptId, {
            isPassed,
            timeLeft: 0,
            receivedPercent,
            timeTaken,
            receivedPoints,
            totalPoints,
            observedAt: new Date(),
            attemptStatus: QuizAttemptStatus.Ended,
        })

        return {
            message: "Quiz ended successfully!",
            others: {
                receivedPercent,
                isPassed,
                timeTaken,
                receivedPoints,
                totalPoints,
            },
        }
    }

    async createCourseReport(
        input: CreateCourseReportInput,
    ): Promise<CreateCourseReportOutput> {
        const { data, accountId } = input
        const { courseId, title, description } = data

        const reportedCourse = await this.courseMySqlRepository.findOneBy({
            courseId,
        })

        if (!reportedCourse || reportedCourse.isDeleted) {
            throw new NotFoundException(
                "Reported course is not found or has been deleted",
            )
        }

        const processing = await this.reportCourseMySqlRepository.find({
            where: {
                courseId,
            },
        })

        if (
            processing &&
      processing.some(
          (processing) =>
              processing.processStatus === ReportProcessStatus.Processing,
      )
        ) {
            throw new ConflictException(
                "You have reported this course before and it is processing. Try update your report instead.",
            )
        }

        const { reportCourseId } = await this.reportCourseMySqlRepository.save({
            accountId,
            courseId,
            title,
            description,
        })

        return {
            message: `A report to course ${reportedCourse.title} has been submitted.`,
            others: {
                reportCourseId,
            },
        }
    }

    async updateCourseReport(
        input: UpdateCourseReportInput,
    ): Promise<UpdateCourseReportOutput> {
        const { data, accountId } = input
        const { reportCourseId, title, description } = data

        const found = await this.reportCourseMySqlRepository.findOneBy({
            reportCourseId,
        })

        if (!found) {
            throw new NotFoundException("Post's report not found.")
        }

        if (found.processStatus !== ReportProcessStatus.Processing) {
            throw new ConflictException("This report has been resolved and closed.")
        }

        if (found.accountId !== accountId) {
            throw new ConflictException("You aren't the owner of this report.")
        }

        await this.reportCourseMySqlRepository.update(reportCourseId, {
            title,
            description,
        })

        return {
            message: "Your Report has been updated successfully",
            others: {
                reportCourseId,
            },
        }
    }

    async resolveCourseReport(
        input: ResolveCourseReportInput,
    ): Promise<ResolveCourseReportOutput> {
        const { data } = input
        const { reportCourseId, processNote, processStatus } = data

        const found = await this.reportCourseMySqlRepository.findOne({
            where: {
                reportCourseId,
            },
            relations: {
                reportedCourse: {
                    creator: true,
                    enrolledInfos: {
                        account: true
                    }
                },
                reporterAccount: true,
            },
        })

        if (!found) {
            throw new NotFoundException("Report not found")
        }

        if (found.processStatus !== ReportProcessStatus.Processing) {
            throw new ConflictException("This report has already been resolved")
        }

        await this.reportCourseMySqlRepository.update(reportCourseId, {
            processStatus,
            processNote,
        })

        if (processStatus === ReportProcessStatus.Approved) {
            await this.courseMySqlRepository.update(found.courseId, {
                verifyStatus: CourseVerifyStatus.Rejected,
                previousFeedback: processNote
            })

            await this.notificationMySqlRepository.save({
                receiverId: found.reportedCourse.creatorId,
                title: "You course has been reported!",
                type: NotificationType.Course,
                courseId: found.courseId,
                description: `Course ${found.reportedCourse.title} has been reported. Please check email to see reason, please edit and resubmit`,
                referenceLink: `/courses/${found.courseId}/management`,
            })

            const accounts = found.reportedCourse.enrolledInfos.map(({ account }) => account)
            for (const account of accounts) {
                await this.notificationMySqlRepository.save({
                    receiverId: account.accountId,
                    title: "You course you enrolled has been reported!",
                    type: NotificationType.Course,
                    courseId: found.courseId,
                    description: `The course '${found.reportedCourse.title}' you enrolled in has been reported. It will be hidden until it is compliant with regulations again.`,
                })
            }
        }

        const { reportedCourse, reporterAccount, createdAt, title, description } =
      found

        await this.mailerService.sendReportCourseMail(
            reportedCourse.creator.email,
            reporterAccount.username,
            reportedCourse.title,
            createdAt,
            title,
            description,
            processStatus,
            processNote,
        )

        return {
            message: "Report successfully resolved.",
        }
    }

    async publishCourse(input: PublishCourseInput): Promise<PublishCourseOutput> {
        const { data } = input
        const { courseId } = data

        const course = await this.courseMySqlRepository.findOneBy({ courseId })

        if (!course) {
            throw new NotFoundException("Course not found or has been deleted")
        }

        await this.courseMySqlRepository.update(courseId, {
            verifyStatus: CourseVerifyStatus.Pending,
        })

        await this.notificationMySqlRepository.save({
            receiverId: course.creatorId,
            title: "Course Submitted for Verification",
            type: NotificationType.Course,
            courseId,
            description: `Your newly created course, "${course.title}", has been submitted to our moderation team for verification. Thank you for choosing CiStudy as the place to realize your teaching dreams.`,
            referenceLink: `/courses/${courseId}/management`,
        })

        const moderators = (
            await this.accountMySqlRepository.find({
                relations: {
                    roles: true,
                },
            })
        ).filter(({ roles }) =>
            roles.map(({ name }) => name).includes(SystemRoles.Moderator),
        )

        const notificationsToModerator: Array<
      DeepPartial<NotificationMySqlEntity>
    > = moderators.map(({ accountId }) => ({
        receiverId: accountId,
        title: "Course Submitted for Verification",
        type: NotificationType.Course,
        courseId,
        description: `A new course "${course.title}" has been submitted. Please take a look to resolve.`,
        referenceLink: `/moderator/course-preview/${courseId}`,
    }))

        await this.notificationMySqlRepository.save(notificationsToModerator)

        return {
            message: "Your course has been submitted for review, thank you.",
        }
    }

    async updateQuizAttempt(
        input: UpdateQuizAttemptInput,
    ): Promise<UpdateQuizAttemptOutput> {
        const { data } = input
        const { quizAttemptId, currentQuestionPosition } = data

        await this.quizAttemptMySqlRepository.update(quizAttemptId, {
            currentQuestionPosition,
        })

        return {
            message: "Your attempt has been updated successfully",
        }
    }

    async updateQuizAttemptAnswers(
        input: UpdateQuizAttemptAnswersInput,
    ): Promise<UpdateQuizAttemptOutput> {
        const { data } = input
        const { quizAttemptId, quizQuestionId, quizQuestionAnswerIds } = data

        const answers = await this.quizQuestionAnswerMySqlRepository.find({
            where: {
                quizQuestionId,
            },
        })

        await this.quizAttemptAnswerMySqlRepository.delete({
            quizAttemptId,
            quizQuestionAnswerId: In(
                answers.map(({ quizQuestionAnswerId }) => quizQuestionAnswerId),
            ),
        })

        await this.quizAttemptAnswerMySqlRepository.save(
            quizQuestionAnswerIds.map((quizQuestionAnswerId) => ({
                quizQuestionAnswerId,
                quizAttemptId,
            })),
        )
        const { point } = await this.quizQuestionMySqlRepository.findOneBy({
            quizQuestionId,
        })

        await this.quizAttemptQuestionMySqlRepository.delete({
            quizAttemptId,
            quizQuestionId,
        })

        await this.quizAttemptQuestionMySqlRepository.save({
            quizAttemptId,
            quizQuestionId,
            actualPoints: point,
            maxPoints: point,
        })

        return {
            message: "Your attempt has been updated successfully",
        }
    }

    async markAsCompletedResource(
        input: MarkAsCompletedResourceInput,
    ): Promise<MarkAsCompletedResourceOutput> {
        const { data, accountId } = input
        const { resourceId } = data

        await this.completeResourceMySqlRepository.save({
            accountId,
            resourceId,
        })

        return {
            message: "Marked successfully",
        }
    }

    async updateLessonProgress(
        input: UpdateLessonProgressInput,
    ): Promise<UpdateLessonProgressOutput> {
        const { data, accountId } = input
        const { lessonId, completeFirstWatch, completePercent } = data

        let progress = await this.progressMySqlRepository.findOne({
            where: {
                lessonId,
                accountId,
            },
        })

        if (!progress) {
            progress = await this.progressMySqlRepository.save({
                lessonId,
                accountId,
                completeFirstWatch,
                completePercent,
            })
        } else {
            await this.progressMySqlRepository.update(progress.progressId, {
                completeFirstWatch,
                completePercent,
            })
        }

        return {
            message: "Update progress succesfully.",
        }
    }

    async deleteCourse(input: DeleteCourseInput): Promise<DeleteCourseOutput> {
        const { data, accountId } = input
        const { courseId } = data

        const course = await this.courseMySqlRepository.findOneBy({ courseId })

        if (!course) {
            throw new NotFoundException(
                "Course not found or have been already disabled",
            )
        }

        if (accountId !== course.creatorId) {
            throw new ConflictException("You are not the creator of the course")
        }

        if (
            course.verifyStatus === CourseVerifyStatus.Approved ||
      course.verifyStatus === CourseVerifyStatus.Pending
        ) {
            throw new ConflictException(
                "You cannot delete course once it has been submitted for reviewing or are being approved",
            )
        }

        await this.courseMySqlRepository.update(courseId, { isDeleted: true })

        return {
            message: "Course has been deleted",
        }
    }

    async deleteAdminCourse(
        input: DeleteAdminCourseInput,
    ): Promise<DeleteAdminCourseOutput> {
        const { data } = input
        const { courseId } = data
        await this.courseMySqlRepository.update(courseId, { isDeleted: true })
        return {
            message: "Course has been deleted",
        }
    }
}
