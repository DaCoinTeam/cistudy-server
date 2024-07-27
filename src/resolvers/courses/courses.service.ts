import {
    CategoryMySqlEntity,
    CourseMySqlEntity,
    CourseReviewMySqlEntity,
    CourseTargetMySqlEntity,
    EnrolledInfoMySqlEntity,
    FollowMySqlEnitity,
    LessonMySqlEntity,
    ProgressMySqlEntity,
    QuizAttemptMySqlEntity,
    QuizMySqlEntity,
    QuizQuestionMySqlEntity,
    ReportCourseMySqlEntity,
    ResourceAttachmentMySqlEntity,
    ResourceMySqlEntity,
    SectionContentMySqlEntity,
    CourseRating,
} from "@database"
import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DataSource, Like } from "typeorm"
import {
    FindOneCourseInput,
    FindManyCoursesInput,
    FindManyLessonsInput,
    FindManyCourseTargetsInput,
    FindOneCourseReviewInput,
    FindManyCourseReviewsInput,
    FindManyCoursesTopicInput,
    FindOneQuizAttemptInput,
    FindManyLevelCategoriesInput,
    FindManyCourseReportsInput,
    FindOneCourseAuthInput,
    FindOneSectionContentInput,
} from "./courses.input"
import {
    FindManyCourseReportsOutputData,
    FindManyCourseReviewsOutputData,
    FindManyCoursesOutputData,
    FindManyCoursesTopicOutputData,
    FindOneQuizAttemptOutput,
} from "./courses.output"
import {
    CompleteState,
    CourseVerifyStatus,
    LockState,
    QuizAttemptStatus,
    SectionContentType,
} from "@common"

@Injectable()
export class CoursesService {
    constructor(
    @InjectRepository(CourseMySqlEntity)
    private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
    @InjectRepository(SectionContentMySqlEntity)
    private readonly sectionContentMySqlRepository: Repository<SectionContentMySqlEntity>,
    @InjectRepository(LessonMySqlEntity)
    private readonly lessonMySqlRepository: Repository<LessonMySqlEntity>,
    @InjectRepository(ResourceMySqlEntity)
    private readonly resourceMySqlRepository: Repository<ResourceMySqlEntity>,
    @InjectRepository(ResourceAttachmentMySqlEntity)
    private readonly resourceAttachmentMySqlRepository: Repository<ResourceAttachmentMySqlEntity>,
    @InjectRepository(CourseTargetMySqlEntity)
    private readonly courseTargetMySqlRepository: Repository<CourseTargetMySqlEntity>,
    @InjectRepository(CategoryMySqlEntity)
    private readonly categoryMySqlRepository: Repository<CategoryMySqlEntity>,
    @InjectRepository(CourseReviewMySqlEntity)
    private readonly courseReviewMySqlRepository: Repository<CourseReviewMySqlEntity>,
    @InjectRepository(EnrolledInfoMySqlEntity)
    private readonly enrolledInfoMySqlRepository: Repository<EnrolledInfoMySqlEntity>,
    @InjectRepository(QuizAttemptMySqlEntity)
    private readonly quizAttemptMySqlRepository: Repository<QuizAttemptMySqlEntity>,
    @InjectRepository(QuizQuestionMySqlEntity)
    private readonly quizQuestionMySqlRepository: Repository<QuizQuestionMySqlEntity>,
    @InjectRepository(ReportCourseMySqlEntity)
    private readonly reportCourseMySqlRepository: Repository<ReportCourseMySqlEntity>,
    @InjectRepository(QuizMySqlEntity)
    private readonly quizMySqlRepository: Repository<QuizMySqlEntity>,
    @InjectRepository(ProgressMySqlEntity)
    private readonly progressMySqlRepository: Repository<ProgressMySqlEntity>,
    @InjectRepository(FollowMySqlEnitity)
    private readonly followMySqlRepository: Repository<FollowMySqlEnitity>,
    private readonly dataSource: DataSource,
    ) {}

    async findManyCourseReviews(
        input: FindManyCourseReviewsInput,
    ): Promise<FindManyCourseReviewsOutputData> {
        const { data } = input
        const { params, options } = data
        const { courseId } = params
        const { skip, take } = options

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const results = await this.courseReviewMySqlRepository.find({
                where: { courseId },
                relations: {
                    course: true,
                    account: true,
                },
                skip,
                take,
                order: { createdAt: "DESC" },
            })

            const numberOfCourseReviewsResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(CourseReviewMySqlEntity, "course-review")
                .where("courseId = :courseId ", { courseId })
                .getRawOne()

            return {
                results,
                metadata: {
                    count: numberOfCourseReviewsResult.count,
                },
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    async findOneCourse(input: FindOneCourseInput): Promise<CourseMySqlEntity> {
        const { data } = input
        const { params } = data
        const { courseId, accountId } = params

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const course = await this.courseMySqlRepository.findOne({
                where: { courseId },
                relations: {
                    sections: {
                        contents: {
                            lesson: true,
                            quiz: {
                                questions: {
                                    answers: true,
                                },
                            },
                            resource: {
                                attachments: true,
                            },
                        },
                    },
                    courseTargets: true,
                    creator: true,
                    courseCategories: {
                        category: true,
                    },
                },
                order: {
                    courseTargets: {
                        position: "ASC",
                    },
                    courseCategories: {
                        category: {
                            level: "ASC",
                        },
                    },
                },
            })

            const enrolledInfo = accountId
                ? await this.enrolledInfoMySqlRepository.findOneBy({
                    courseId,
                    accountId,
                })
                : undefined

            const isReviewed = accountId
                ? await this.courseReviewMySqlRepository.findOneBy({
                    courseId,
                    accountId,
                })
                : undefined

            const numberOfFollowersResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(FollowMySqlEnitity, "follow")
                .where("followedAccountId = :accountId", {
                    accountId: course.creator.accountId,
                })
                .andWhere("followed = :followed", { followed: true })
                .getRawOne()

            const numberOfEnrollmentsResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(EnrolledInfoMySqlEntity, "enrolled_info")
                .andWhere("courseId = :courseId", { courseId })
                .getRawOne()

            await queryRunner.commitTransaction()

            course.creator.numberOfFollowers = numberOfFollowersResult.count
            course.numberOfEnrollments = numberOfEnrollmentsResult.count

            course.enrolled = enrolledInfo ? true : false
            course.isReviewed = isReviewed ? true : false

            const courseReviews = await this.courseReviewMySqlRepository.findBy({
                courseId,
            })

            const countWithNumStars = (numStars: number) => {
                let count = 0
                for (const { rating } of courseReviews) {
                    if (rating === numStars) {
                        count++
                    }
                }

                return count
            }

            const numberOf1StarRatings = countWithNumStars(1)
            const numberOf2StarRatings = countWithNumStars(2)
            const numberOf3StarRatings = countWithNumStars(3)
            const numberOf4StarRatings = countWithNumStars(4)
            const numberOf5StarRatings = countWithNumStars(5)
            const totalNumberOfRatings = courseReviews.length

            const totalNumStars = () => {
                let total = 0
                for (let index = 1; index <= 5; index++) {
                    total += countWithNumStars(index) * index
                }
                return total
            }

            const overallCourseRating =
        totalNumberOfRatings > 0 ? totalNumStars() / totalNumberOfRatings : 0

            const courseRatings: CourseRating = {
                numberOf1StarRatings,
                numberOf2StarRatings,
                numberOf3StarRatings,
                numberOf4StarRatings,
                numberOf5StarRatings,
                overallCourseRating,
                totalNumberOfRatings,
            }

            course.courseRatings = courseRatings
            course.isCreator = accountId ? accountId === course.creatorId : false

            const numberOfLessons = await this.lessonMySqlRepository.count({
                where: {
                    sectionContent: {
                        section: {
                            course: {
                                courseId,
                            },
                        },
                    },
                },
            })

            const numberOfQuizzes = await this.quizMySqlRepository.count({
                where: {
                    sectionContent: {
                        section: {
                            course: {
                                courseId,
                            },
                        },
                    },
                },
            })

            const numberOfResources =
        await this.resourceAttachmentMySqlRepository.count({
            where: {
                resource: {
                    sectionContent: {
                        section: {
                            course: {
                                courseId,
                            },
                        },
                    },
                },
            },
        })
            course.numberOfLessons = numberOfLessons
            course.numberOfResources = numberOfResources
            course.numberOfQuizzes = numberOfQuizzes

            return course
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findOneCourseAuth(
        input: FindOneCourseAuthInput,
    ): Promise<CourseMySqlEntity> {
        const { data } = input
        const { params } = data
        const { courseId, accountId } = params

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const course = await this.courseMySqlRepository.findOne({
                where: { courseId },
                relations: {
                    sections: {
                        contents: {
                            lesson: true,
                            quiz: true,
                            resource: true,
                        },
                    },
                    courseTargets: true,
                    creator: true,
                    courseCategories: {
                        category: true,
                    },
                },
                order: {
                    courseTargets: {
                        position: "ASC",
                    },
                    courseCategories: {
                        category: {
                            level: "ASC",
                        },
                    },
                },
            })

            const enrolledInfo = accountId
                ? await this.enrolledInfoMySqlRepository.findOneBy({
                    courseId,
                    accountId,
                })
                : undefined

            const isReviewed = accountId
                ? await this.courseReviewMySqlRepository.findOneBy({
                    courseId,
                    accountId,
                })
                : undefined

            const numberOfFollowersResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(FollowMySqlEnitity, "follow")
                .where("followedAccountId = :accountId", {
                    accountId: course.creator.accountId,
                })
                .andWhere("followed = :followed", { followed: true })
                .getRawOne()

            const numberOfEnrollmentsResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(EnrolledInfoMySqlEntity, "enrolled_info")
                .andWhere("courseId = :courseId", { courseId })
                .getRawOne()

            await queryRunner.commitTransaction()

            course.creator.numberOfFollowers = numberOfFollowersResult.count
            course.numberOfEnrollments = numberOfEnrollmentsResult.count

            course.enrolled = enrolledInfo ? true : false
            course.isReviewed = isReviewed ? true : false

            const courseReviews = await this.courseReviewMySqlRepository.findBy({
                courseId,
            })

            const countWithNumStars = (numStars: number) => {
                let count = 0
                for (const { rating } of courseReviews) {
                    if (rating === numStars) {
                        count++
                    }
                }

                return count
            }

            const numberOf1StarRatings = countWithNumStars(1)
            const numberOf2StarRatings = countWithNumStars(2)
            const numberOf3StarRatings = countWithNumStars(3)
            const numberOf4StarRatings = countWithNumStars(4)
            const numberOf5StarRatings = countWithNumStars(5)
            const totalNumberOfRatings = courseReviews.length

            const totalNumStars = () => {
                let total = 0
                for (let index = 1; index <= 5; index++) {
                    total += countWithNumStars(index) * index
                }
                return total
            }

            const overallCourseRating =
        totalNumberOfRatings > 0 ? totalNumStars() / totalNumberOfRatings : 0

            const courseRatings: CourseRating = {
                numberOf1StarRatings,
                numberOf2StarRatings,
                numberOf3StarRatings,
                numberOf4StarRatings,
                numberOf5StarRatings,
                overallCourseRating,
                totalNumberOfRatings,
            }

            course.courseRatings = courseRatings
            course.isCreator = accountId ? accountId === course.creatorId : false

            const numberOfLessons = await this.lessonMySqlRepository.count({
                where: {
                    sectionContent: {
                        section: {
                            course: {
                                courseId,
                            },
                        },
                    },
                },
            })

            const numberOfQuizzes = await this.quizMySqlRepository.count({
                where: {
                    sectionContent: {
                        section: {
                            course: {
                                courseId,
                            },
                        },
                    },
                },
            })

            const numberOfResources = await this.resourceMySqlRepository.count({
                where: {
                    sectionContent: {
                        section: {
                            course: {
                                courseId,
                            },
                        },
                    },
                },
            })
            course.numberOfLessons = numberOfLessons
            course.numberOfResources = numberOfResources
            course.numberOfQuizzes = numberOfQuizzes

            return course
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findManyCourses(
        input: FindManyCoursesInput,
    ): Promise<FindManyCoursesOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take, searchValue, categoryIds } = { ...options }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            let results = await this.courseMySqlRepository.find({
                where: {
                    title: searchValue ? Like(`%${searchValue}%`) : undefined,
                    verifyStatus: CourseVerifyStatus.Approved,
                },
                relations: {
                    creator: true,
                    courseCategories: {
                        category: true,
                    },
                    sections: {
                        contents: {
                            lesson: true,
                        },
                    },
                    courseTargets: true,
                },
            })

            if (categoryIds?.length) {
                results = results.filter(({ courseCategories }) => {
                    let found = false
                    for (const { categoryId } of courseCategories) {
                        if (categoryIds.includes(categoryId)) {
                            found = true
                        }
                    }
                    return found
                })
            }

            const count = results.length

            results = results.slice(skip, skip + take)

            const promises: Array<Promise<void>> = []

            for (const course of results) {
                const promise = async () => {
                    const courseReviews = await this.courseReviewMySqlRepository.find({
                        where: {
                            courseId: course.courseId,
                        },
                    })
                    const countWithNumStars = (numStars: number) => {
                        let count = 0
                        for (const { rating } of courseReviews) {
                            if (rating === numStars) {
                                count++
                            }
                        }

                        return count
                    }

                    const numberOf1StarRatings = countWithNumStars(1)
                    const numberOf2StarRatings = countWithNumStars(2)
                    const numberOf3StarRatings = countWithNumStars(3)
                    const numberOf4StarRatings = countWithNumStars(4)
                    const numberOf5StarRatings = countWithNumStars(5)
                    const totalNumberOfRatings = courseReviews.length

                    const totalNumStars = () => {
                        let total = 0
                        for (let index = 1; index <= 5; index++) {
                            total += countWithNumStars(index) * index
                        }
                        return total
                    }

                    const overallCourseRating =
            totalNumberOfRatings > 0
                ? totalNumStars() / totalNumberOfRatings
                : 0

                    const courseRatings: CourseRating = {
                        numberOf1StarRatings,
                        numberOf2StarRatings,
                        numberOf3StarRatings,
                        numberOf4StarRatings,
                        numberOf5StarRatings,
                        overallCourseRating,
                        totalNumberOfRatings,
                    }

                    course.courseRatings = courseRatings
                    const numberOfEnrollments =
            await this.enrolledInfoMySqlRepository.findBy({
                courseId: course.courseId,
            })
                    const numberOfQuizzes = await this.quizMySqlRepository.count({
                        where: {
                            sectionContent: {
                                section: {
                                    course: {
                                        courseId: course.courseId,
                                    },
                                },
                            },
                        },
                    })

                    const numberOfResources = await this.resourceMySqlRepository.count({
                        where: {
                            sectionContent: {
                                section: {
                                    course: {
                                        courseId: course.courseId,
                                    },
                                },
                            },
                        },
                    })

                    const numberOfLessons = await this.lessonMySqlRepository.count({
                        where: {
                            sectionContent: {
                                section: {
                                    course: {
                                        courseId: course.courseId,
                                    },
                                },
                            },
                        },
                    })

                    course.numberOfEnrollments = numberOfEnrollments.length
                    course.numberOfResources = numberOfResources
                    course.numberOfQuizzes = numberOfQuizzes
                    course.numberOfLessons = numberOfLessons
                }
                promises.push(promise())
            }

            await Promise.all(promises)

            const relativeTopics = searchValue
                ? await this.categoryMySqlRepository.find({
                    where: {
                        level: 2,
                        name: searchValue ? Like(`%${searchValue}%`) : undefined,
                    },
                })
                : undefined

            await queryRunner.commitTransaction()
            return {
                results,
                metadata: {
                    count,
                    relativeTopics,
                },
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    async findOneSectionContent(
        input: FindOneSectionContentInput,
    ): Promise<SectionContentMySqlEntity> {
        const { data, accountId } = input
        const { params } = data
        const { sectionContentId } = params

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const { enrolledInfoId } = await this.enrolledInfoMySqlRepository.findOne(
                {
                    where: {
                        accountId,
                    },
                },
            )

            const sectionContent = await this.sectionContentMySqlRepository.findOne({
                where: { sectionContentId },
                relations: {
                    accountProgresses: true,
                    quiz: {
                        questions: {
                            answers: {
                                attemptAnswers: true,
                            },
                        },
                    },
                    resource: {
                        attachments: true,
                    },
                    lesson: true,
                    section: {
                        course: {
                            creator: true,
                            sections: {
                                contents: {
                                    section: true,
                                    quiz: {
                                        questions: {
                                            answers: true,
                                        },
                                    },
                                    lesson: true,
                                    resource: {
                                        attachments: true,
                                    },
                                    accountProgresses: true,
                                },
                            },
                        },
                    },
                },
            })

            let activeQuizAttempt = await this.quizAttemptMySqlRepository.findOne({
                where: {
                    quizId: sectionContentId,
                    accountId,
                    attemptStatus: QuizAttemptStatus.Started,
                },
                relations: {
                    attemptAnswers: true,
                },
            })

            if (!activeQuizAttempt) {
                activeQuizAttempt = await this.quizAttemptMySqlRepository.save({
                    quizId: sectionContentId,
                    accountId,
                    attemptStatus: QuizAttemptStatus.Started,
                })
            }

            const currentTimeLeft =
        activeQuizAttempt.timeLeft -
        (Date.now() - activeQuizAttempt.observedAt.getTime())

            if (currentTimeLeft <= 0) {
                await this.quizAttemptMySqlRepository.update(
                    activeQuizAttempt.quizAttemptId,
                    {
                        attemptStatus: QuizAttemptStatus.Ended,
                        timeLeft: 0,
                        observedAt: new Date()
                    },
                )
                activeQuizAttempt.timeLeft = 0
            } else {
                await this.quizAttemptMySqlRepository.update(
                    activeQuizAttempt.quizAttemptId,
                    {
                        timeLeft: currentTimeLeft,
                        observedAt: new Date()
                    },
                )
                activeQuizAttempt.timeLeft = currentTimeLeft
            }

            sectionContent.quiz.activeQuizAttempt = activeQuizAttempt

            sectionContent.quiz.questions = sectionContent.quiz.questions.map(
                (question) => {
                    const answered = question.answers
                        .map(
                            (answer) => {
                                const attemptAnswer = answer.attemptAnswers.find(
                                    ({ quizAttemptId, quizQuestionAnswerId }) =>
                                        activeQuizAttempt.quizAttemptId === quizAttemptId &&
                    quizQuestionAnswerId === answer.quizQuestionAnswerId,
                                )
                                return !!attemptAnswer 
                            } 
                        ).includes(true)

                    question.answered = answered

                    question.numberOfCorrectAnswers = question.answers.filter(({isCorrect}) => isCorrect).length
                    return question
                },
            )

            let progress = sectionContent.accountProgresses.find(
                (progress) =>
                    enrolledInfoId === progress.enrolledInfoId &&
          sectionContent.sectionContentId === progress.sectionContentId,
            )

            if (!progress) {
                progress = await this.progressMySqlRepository.save({
                    sectionContentId: sectionContent.sectionContentId,
                    enrolledInfoId,
                })
            }

            sectionContent.completeState = progress.completeState

            const creatorFollow = await this.followMySqlRepository.find({
                where: {
                    followedAccountId: sectionContent.section.course.creator.accountId,
                    followed: true,
                },
            })

            if (sectionContent.quiz) {
                const { passingPercent, quizAttempts } = sectionContent.quiz

                if (quizAttempts) {
                    const finishedAttempts = quizAttempts
                        .filter(
                            (attempt) => attempt.attemptStatus === QuizAttemptStatus.Ended,
                        )
                        .sort((prev, next) => next.score - prev.score)

                    if (finishedAttempts && finishedAttempts.length > 0) {
                        sectionContent.quiz.totalNumberOfAttempts = finishedAttempts.length
                        sectionContent.quiz.highestScoreRecorded = finishedAttempts[0].score

                        const latestAttempt = finishedAttempts.sort(
                            (prev, next) =>
                                prev.createdAt.getTime() - next.createdAt.getTime(),
                        )

                        sectionContent.quiz.lastAttemptScore = latestAttempt[0].score
                        const milliseconds = latestAttempt[0].timeTaken

                        const millisecondsToTime = (milliseconds: number) => {
                            const hours = Math.floor(milliseconds / (1000 * 60 * 60))
                            const minutes = Math.floor(
                                (milliseconds % (1000 * 60 * 60)) / (1000 * 60),
                            )
                            const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)
                            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
                        }

                        const lastAttemptTimeTaken = millisecondsToTime(milliseconds)
                        sectionContent.quiz.lastAttemptTimeTaken = lastAttemptTimeTaken
                        sectionContent.quiz.isPassed =
              finishedAttempts[0].score >= passingPercent

                        const now = new Date()
                        const startOfDay = new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            now.getDate(),
                            0,
                            0,
                            0,
                        )
                        const endOfDay = new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            now.getDate(),
                            23,
                            59,
                            59,
                        )

                        const currentDateAttempts = sectionContent.quiz.quizAttempts
                            .sort(
                                (prev, next) =>
                                    prev.createdAt.getTime() - next.createdAt.getTime(),
                            )
                            .filter(
                                (attempt) =>
                                    attempt.createdAt > startOfDay &&
                  attempt.createdAt < endOfDay,
                            )

                        if (currentDateAttempts.length >= 3) {
                            const thirdAttemptTimestamps = currentDateAttempts
                                .filter((_, index) => (index + 1) % 3 === 0)
                                .map((attempt) => attempt.createdAt)

                            if (thirdAttemptTimestamps.length > 0) {
                                const latestThirdAttemptTimestamp =
                  thirdAttemptTimestamps[thirdAttemptTimestamps.length - 1]
                                const unlockTime = new Date(latestThirdAttemptTimestamp)
                                unlockTime.setHours(unlockTime.getHours() + 8)

                                if (now < unlockTime) {
                                    sectionContent.quiz.isLocked = true
                                }
                            }
                        }
                    }
                }
            }

            sectionContent.section.course.creator.numberOfFollowers =
        creatorFollow.length

            sectionContent.section.course.creator.followed = creatorFollow.some(
                (followed) => followed.followerId === accountId,
            )

            const promises: Array<Promise<void>> = []
            for (const section of sectionContent.section.course.sections) {
                for (const content of section.contents) {
                    const promise = async () => {
                        let progress = content.accountProgresses.find(
                            (progress) =>
                                enrolledInfoId === progress.enrolledInfoId &&
                content.sectionContentId === progress.sectionContentId,
                        )
                        if (!progress) {
                            progress = await this.progressMySqlRepository.save({
                                sectionContentId: content.sectionContentId,
                                enrolledInfoId,
                            })
                        }
                        content.completeState = progress.completeState
                    }
                    promises.push(promise())
                }
            }
            await Promise.all(promises)

            const sections = Object.assign(sectionContent.section.course.sections, [])
            sections.sort((prev, next) => prev.position - next.position)
            sections.at(0).lockState = LockState.InProgress

            if (sections.length > 1) {
                for (let i = 1; i < sections.length; i++) {
                    let allCompleted = true
                    let hasCompletedOrFailed = false

                    for (const content of sections[i - 1].contents) {
                        if (
                            content.completeState === CompleteState.Completed ||
              content.completeState === CompleteState.Failed
                        ) {
                            hasCompletedOrFailed = true
                        }
                        if (content.completeState !== CompleteState.Completed) {
                            allCompleted = false
                        }
                    }

                    if (allCompleted) {
                        sections[i].lockState = LockState.Completed
                    } else if (hasCompletedOrFailed) {
                        sections[i].lockState = LockState.InProgress
                    } else {
                        sections[i].lockState = LockState.Locked
                    }
                }
            }

            sectionContent.section.course.sections = sections

            await queryRunner.commitTransaction()

            return sectionContent
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    async findManyLessons(
        input: FindManyLessonsInput,
    ): Promise<Array<LessonMySqlEntity>> {
        const { data } = input
        const { params } = data
        const { sectionId } = params

        const contents = await this.sectionContentMySqlRepository.find({
            where: {
                sectionId,
                type: SectionContentType.Lesson,
            },
        })

        return contents.map((contents) => contents.lesson)
    }

    // async findManyResources(
    //     input: FindManyResourcesInput,
    // ): Promise<Array<ResourceMySqlEntity>> {
    //     const { data } = input
    //     const { params } = data
    //     const { lessonId } = params

    //     return await this.resourceMySqlRepository.find({
    //         where: {
    //             lessonId
    //         },
    //     })
    // }

    async findManyCourseTargets(
        input: FindManyCourseTargetsInput,
    ): Promise<Array<CourseTargetMySqlEntity>> {
        const { data } = input
        const { params } = data
        const { courseId } = params

        return await this.courseTargetMySqlRepository.find({
            where: {
                courseId,
            },
        })
    }

    async findManyCategories(): Promise<Array<CategoryMySqlEntity>> {
        const results = await this.categoryMySqlRepository.find({
            where: {
                level: 0,
            },
            relations: {
                categoryParentRelations: {
                    category: {
                        categoryParentRelations: {
                            category: true,
                        },
                    },
                },
            },
        })
        return results
    }

    async findManyLevelCategories(
        input: FindManyLevelCategoriesInput,
    ): Promise<Array<CategoryMySqlEntity>> {
        const { data } = input
        const { params } = data
        const { level } = params
        return await this.categoryMySqlRepository.findBy({ level })
    }

    async findOneCourseReview(input: FindOneCourseReviewInput) {
        const { data } = input
        const { params } = data
        const { courseId } = params

        return await this.courseMySqlRepository.findOne({
            where: {
                courseId,
            },
            relations: {
                creator: true,
                sections: {
                    contents: {
                        lesson: true,
                    },
                },
                posts: {
                    course: true,
                },
            },
        })
    }

    async findManyCoursesTopic(
        input: FindManyCoursesTopicInput,
    ): Promise<FindManyCoursesTopicOutputData> {
        const { data } = input
        const { params, options } = data
        const { topicId } = params
        const { take, skip } = { ...options }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const results = await queryRunner.manager
                .createQueryBuilder(CourseMySqlEntity, "course")
                .innerJoinAndSelect("course.courseTopics", "course_topic")
                .where("course_topic.topicId = :topicId", { topicId })
                .skip(skip)
                .take(take)
                .getMany()

            const numberOfCoursesTopicResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(course.courseId)", "count")
                .from(CourseMySqlEntity, "course")
                .innerJoin("course.courseTopics", "course_topic")
                .where("course_topic.topicId = :topicId", { topicId })
                .getRawOne()

            await queryRunner.commitTransaction()

            return {
                results,
                metadata: {
                    count: numberOfCoursesTopicResult.count,
                },
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    async findOneQuizAttempt(
        input: FindOneQuizAttemptInput,
    ): Promise<FindOneQuizAttemptOutput> {
        const { accountId, data } = input
        const { params, options } = data
        const { quizAttemptId } = params
        const { skip, take } = options

        const found = await this.quizAttemptMySqlRepository.findOne({
            where: {
                accountId,
                quizAttemptId,
            },
            relations: {
                quiz: {
                    questions: {
                        answers: true,
                    },
                },
            },
        })
        if (!found) {
            throw new NotFoundException("Attempt not found or not started by user")
        }
        const { quizId } = found
        const quizQuestions = await this.quizQuestionMySqlRepository.find({
            where: {
                quizId,
            },
            skip,
            take,
            relations: {
                answers: true,
            },
        })

        found.quiz.questions = quizQuestions

        return {
            data: found,
            numberOfQuestions: quizQuestions.length,
        }
    }

    async findManyCourseReports(
        input: FindManyCourseReportsInput,
    ): Promise<FindManyCourseReportsOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = options

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const results = await this.reportCourseMySqlRepository.find({
                relations: {
                    reporterAccount: true,
                    reportedCourse: true,
                },
                skip,
                take,
            })

            const numberOfCourseReports = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(ReportCourseMySqlEntity, "report-course")
                .getRawOne()

            return {
                results,
                metadata: {
                    count: numberOfCourseReports.count,
                },
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }
}
