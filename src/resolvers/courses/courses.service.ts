import {
    CertificateStatus,
    CompleteState,
    CourseVerifyStatus,
    LockState,
    QuizAttemptStatus,
    ReportProcessStatus,
    SectionContentType,
} from "@common"
import {
    CartCourseMySqlEntity,
    CategoryMySqlEntity,
    CertificateMySqlEntity,
    CompleteResourceMySqlEntity,
    CourseConfigurationMySqlEntity,
    CourseMySqlEntity,
    CourseRating,
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
} from "@database"
import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, DeepPartial, Like, Not, Repository } from "typeorm"
import {
    FindManyCourseReportsInput,
    FindManyCourseReviewsInput,
    FindManyCoursesInput,
    FindManyCourseTargetsInput,
    FindManyLessonsInput,
    FindManyLevelCategoriesInput,
    FindManyQuizAttemptsInput,
    FindOneCourseAuthInput,
    FindOneCourseInput,
    FindOneCourseReviewInput,
    FindOneQuizAttemptInput,
    FindOneSectionContentInput,
} from "./courses.input"
import {
    FindManyCourseReportsOutputData,
    FindManyCourseReviewsOutputData,
    FindManyCoursesOutputData,
    FindManyQuizAttemptsOutputData,
    FindOneQuizAttemptOutput,
} from "./courses.output"
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager"

@Injectable()
export class CoursesService {
    constructor(
    @InjectRepository(CourseMySqlEntity)
    private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
    @InjectRepository(CertificateMySqlEntity)
    private readonly certificateMySqlRepository: Repository<CertificateMySqlEntity>,
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
    @InjectRepository(CartCourseMySqlEntity)
    private readonly cartCourseMySqlRepository: Repository<CartCourseMySqlEntity>,
    @InjectRepository(CategoryMySqlEntity)
    private readonly categoryMySqlRepository: Repository<CategoryMySqlEntity>,
    @InjectRepository(CourseReviewMySqlEntity)
    private readonly courseReviewMySqlRepository: Repository<CourseReviewMySqlEntity>,
    @InjectRepository(EnrolledInfoMySqlEntity)
    private readonly enrolledInfoMySqlRepository: Repository<EnrolledInfoMySqlEntity>,
    @InjectRepository(QuizAttemptMySqlEntity)
    private readonly quizAttemptMySqlRepository: Repository<QuizAttemptMySqlEntity>,
    @InjectRepository(CourseConfigurationMySqlEntity)
    private readonly courseConfigurationMySqlRepository: Repository<CourseConfigurationMySqlEntity>,
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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(CompleteResourceMySqlEntity)
    private readonly completeResourceMySqlRepository: Repository<CompleteResourceMySqlEntity>,
    private readonly dataSource: DataSource,
    ) {}

    async findManyCourseReviews(
        input: FindManyCourseReviewsInput,
    ): Promise<FindManyCourseReviewsOutputData> {
        const { data } = input
        const { params, options } = data
        const { courseId } = params
        const { skip, take } = options

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

        const numberOfCourseReviewsResult = await this.courseReviewMySqlRepository.count({
            where: {
                courseId
            }
        })

        return {
            results,
            metadata: {
                count: numberOfCourseReviewsResult,
            },
        }

    }

    async findOneCourse(input: FindOneCourseInput): Promise<CourseMySqlEntity> {
        const { data } = input
        const { params } = data
        const { courseId, accountId } = params

        const course = await this.courseMySqlRepository.findOne({
            where: { courseId, isDeleted: false },
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
                courseReviews: {
                    account: true
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

        const enrolledInfos = await this.enrolledInfoMySqlRepository.find({
            where: {
                courseId: course.courseId
            },
            relations: {
                account: true
            },
            order: {
                createdAt: "DESC"
            }
        })
        course.enrolledInfos = enrolledInfos

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

        const numberOfFollowersResult = await this.followMySqlRepository.count({
            where: {
                followedAccountId: course.creator.accountId,
                followed: true,
            },
        })

        const numberOfEnrollmentsResult =
      await this.enrolledInfoMySqlRepository.count({
          where: {
              courseId,
          },
      })

        course.creator.numberOfFollowers = numberOfFollowersResult
        course.numberOfEnrollments = numberOfEnrollmentsResult

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

        const courseConfigurations = await this.courseConfigurationMySqlRepository.find({
            order: {
                createdAt: "DESC"
            }
        })
        if (courseConfigurations[0]) {
            course.courseConfiguration = courseConfigurations[0]
        }
        return course
    }

    async findOneCourseAuth(
        input: FindOneCourseAuthInput,
    ): Promise<CourseMySqlEntity> {
        const { data } = input
        const { params } = data
        const { courseId, accountId } = params

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()

        const course = await this.courseMySqlRepository.findOne({
            where: { courseId, isDeleted: false },
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

        const numberOfFollowersResult = await this.followMySqlRepository.count({
            where: {
                followedAccountId: course.creator.accountId,
                followed: true,
            },
        })

        const numberOfEnrollmentsResult =
      await this.enrolledInfoMySqlRepository.count({
          where: {
              courseId,
          },
      })

        course.creator.numberOfFollowers = numberOfFollowersResult
        course.numberOfEnrollments = numberOfEnrollmentsResult

        course.enrolled = !!enrolledInfo
        course.isReviewed = !!isReviewed

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

        const certificate = await this.certificateMySqlRepository.findOne({
            where: {
                accountId,
                courseId,
            },
        })
        const isReported = await this.reportCourseMySqlRepository.findOneBy({accountId,courseId,processStatus: ReportProcessStatus.Processing})

        course.numberOfLessons = numberOfLessons
        course.numberOfResources = numberOfResources
        course.numberOfQuizzes = numberOfQuizzes
        course.certificate = certificate
        course.isReported = isReported ? true : false

        const promises: Array<Promise<void>> = []
        for (const section of course.sections) {
            for (const content of section.contents) {
                const promise = async () => {
                    //quiz based
                    switch (content.type) {
                    case SectionContentType.Quiz: {
                        const attempts = await this.quizAttemptMySqlRepository.find({
                            where: {
                                quizId: content.quizId,
                                accountId,
                            },
                        })
                        if (!attempts.length) {
                            content.completeState = CompleteState.Undone
                            break
                        }

                        const doneAttempt = attempts.find(
                            ({ attemptStatus }) =>
                                attemptStatus === QuizAttemptStatus.Ended,
                        )
                        if (!doneAttempt) {
                            content.completeState = CompleteState.Undone
                            break
                        }

                        const found = attempts.find((attempt) => attempt.isPassed)

                        content.completeState = found
                            ? CompleteState.Completed
                            : CompleteState.Failed
                        break
                    }
                    case SectionContentType.Lesson: {
                        const found = await this.progressMySqlRepository.findOne({
                            where: {
                                lessonId: content.sectionContentId,
                                accountId,
                                completeFirstWatch: true,
                            },
                        })

                        content.completeState = found
                            ? CompleteState.Completed
                            : CompleteState.Undone
                        break
                    }
                    case SectionContentType.Resource: {
                        const completeResource =
                await this.completeResourceMySqlRepository.findOne({
                    where: {
                        accountId,
                        resourceId: content.sectionContentId!,
                    },
                })
                        if (!completeResource) {
                            content.completeState = CompleteState.Undone
                        } else {
                            content.completeState = CompleteState.Completed
                        }
                    }
                    }
                }
                promises.push(promise())
            }
        }
        await Promise.all(promises)

        course.certificateStatus = CertificateStatus.Cannot

        const sections = Object.assign(course.sections, [])
        sections.sort((prev, next) => prev.position - next.position)

        for (const section of sections) {
            section.lockState = LockState.Locked
        }
        for (let i = 0; i < sections.length; i++) {
            sections[i].lockState = LockState.InProgress
            let allCompleted = true
            for (const content of sections[i].contents) {
                if (content.completeState !== CompleteState.Completed) {
                    allCompleted = false
                    break
                }
            }

            if (allCompleted) {
                sections[i].lockState = LockState.Completed
                if (i === sections.length - 1) {
                    const certificate = await this.certificateMySqlRepository.findOne({
                        where: {
                            courseId,
                            accountId,
                        },
                    })
                    course.certificateStatus = certificate
                        ? CertificateStatus.Gotten
                        : CertificateStatus.Getable
                }
            } else {
                break
            }

            course.sections = sections

            const certificate = await this.certificateMySqlRepository.findOne({
                where: {
                    courseId,
                    accountId,
                },
            })
            course.certificate = certificate
        }

        let totalContents = 0
        course.sections.forEach(({ contents }) => {
            totalContents += contents.length ?? 0
        })

        let completedContents = 0
        course.sections.forEach(({ contents, lockState }) => {
            contents.forEach(({ completeState }) => {
                if (completeState === CompleteState.Completed && lockState !== LockState.Locked) {
                    completedContents += 1
                }
            })
            
        })

        course.totalContents = totalContents
        course.completedContents = completedContents

        const enrolledInfos = await this.enrolledInfoMySqlRepository.find({
            where: {
                courseId
            },
            relations: {
                account: true
            }
        })

        course.students = enrolledInfos.map(({account}) => account)

        const courseConfigurations = await this.courseConfigurationMySqlRepository.find({
            order: {
                createdAt: "DESC"
            }
        })
        if (courseConfigurations[0]) {
            course.courseConfiguration = courseConfigurations[0]
        }
        
        return course
    }

    async findManyCourses(
        input: FindManyCoursesInput,
    ): Promise<FindManyCoursesOutputData> {
        const { data } = input
        const { params, options } = data
        const { accountId } = params
        const { skip, take, searchValue, categoryIds } = { ...options }

        let results = await this.courseMySqlRepository.find({
            where: {
                title: searchValue ? Like(`%${searchValue}%`) : undefined,
                verifyStatus: CourseVerifyStatus.Approved,
                isDeleted: false
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
            order: {
                createdAt: "DESC"
            }
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

                if(accountId){
                    course.enrolled = (await this.enrolledInfoMySqlRepository.findOneBy({accountId, courseId: course.courseId})) ? true : false
                    course.isCreator = (accountId === course.creatorId)
                    course.isAddedToCart = (await this.cartCourseMySqlRepository.findOneBy({cartId: accountId, courseId: course.courseId}) ? true : false)
                }

                course.numberOfEnrollments = numberOfEnrollments.length
                course.numberOfResources = numberOfResources
                course.numberOfQuizzes = numberOfQuizzes
                course.numberOfLessons = numberOfLessons
            }
            promises.push(promise())
        }

        await Promise.all(promises)
        return {
            results,
            metadata: {
                count
            },
        }
    }

    async findOneSectionContent(
        input: FindOneSectionContentInput,
    ): Promise<SectionContentMySqlEntity> {
        const { data, accountId } = input
        const { params } = data
        const { sectionContentId } = params

        const sectionContent = await this.sectionContentMySqlRepository.findOne({
            where: { sectionContentId },
            relations: {
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
                            },
                        },
                    },
                },
            },
        })

        switch (sectionContent.type) {
        case SectionContentType.Lesson: {
            const lesson = await this.lessonMySqlRepository.findOne({
                where: {
                    lessonId: sectionContentId,
                },
            })
            sectionContent.lesson = lesson

            const found = await this.progressMySqlRepository.findOne({
                where: {
                    lessonId: sectionContentId,
                    accountId,
                    completeFirstWatch: true,
                },
            })

            sectionContent.lesson.enableSeek = !!found
            break
        }
        case SectionContentType.Quiz: {
            const quiz = await this.quizMySqlRepository.findOne({
                where: {
                    quizId: sectionContentId,
                },
                relations: {
                    questions: {
                        answers: true,
                    },
                },
            })

            sectionContent.quiz = quiz

            const activeQuizAttempt = await this.quizAttemptMySqlRepository.findOne(
                {
                    where: {
                        quizId: quiz.quizId,
                        accountId,
                        attemptStatus: QuizAttemptStatus.Started,
                    },
                    relations: {
                        attemptAnswers: true,
                    },
                },
            )

            if (activeQuizAttempt) {
                sectionContent.quiz.activeQuizAttempt = activeQuizAttempt

                const randomQuestions = (await this.cacheManager.get(
                    activeQuizAttempt.quizAttemptId,
                )) as Array<DeepPartial<QuizQuestionMySqlEntity>>

                if (randomQuestions) {
                    for (let index = 0; index < randomQuestions.length; index++) {
                        sectionContent.quiz.questions[index].position =
                randomQuestions[index].position

                        const correspondingAnswers = randomQuestions.find(
                            ({ quizQuestionId }) =>
                                quizQuestionId ===
                  sectionContent.quiz.questions[index].quizQuestionId,
                        ).answers

                        for (
                            let index2 = 0;
                            index2 < correspondingAnswers.length;
                            index2++
                        ) {
                            sectionContent.quiz.questions[index].answers[index2].position =
                  correspondingAnswers[index2].position
                        }
                    }
                }

                sectionContent.quiz.questions = sectionContent.quiz.questions.map(
                    (question) => {
                        const answered = question.answers
                            .map((answer) => {
                                const attemptAnswer = activeQuizAttempt.attemptAnswers.find(
                                    ({ quizQuestionAnswerId }) =>
                                        quizQuestionAnswerId === answer.quizQuestionAnswerId,
                                )
                                return !!attemptAnswer
                            })
                            .includes(true)

                        question.answered = answered

                        question.numberOfCorrectAnswers = question.answers.filter(
                            ({ isCorrect }) => isCorrect,
                        ).length
                        return question
                    },
                )
            }

            const quizAttempts = await this.quizAttemptMySqlRepository.find({
                where: {
                    quizId: quiz.quizId,
                    accountId,
                },
                relations: {
                    attemptAnswers: true,
                },
            })

            sectionContent.quiz.quizAttempts = quizAttempts

            const finishedAttemps = sectionContent.quiz.quizAttempts?.filter(
                ({ attemptStatus }) => attemptStatus === QuizAttemptStatus.Ended,
            )

            if (finishedAttemps.length) {
                sectionContent.quiz.highestScoreRecorded = finishedAttemps.reduce(
                    (max, attempt) => {
                        return (attempt.receivedPercent ?? 0) > max
                            ? attempt.receivedPercent
                            : max
                    },
                    0,
                )

                sectionContent.quiz.totalNumberOfAttempts = finishedAttemps.length
                sectionContent.quiz.lastAttemptScore = finishedAttemps.reduce(
                    (latest, current) => {
                        return current.createdAt > latest.createdAt ? current : latest
                    },
                ).receivedPercent
                sectionContent.quiz.isPassed = !!finishedAttemps.filter(
                    ({ isPassed }) => isPassed,
                ).length
            }

            const last3Attempts = await this.quizAttemptMySqlRepository.find({
                where: {
                    accountId,
                    quizId: quiz.quizId
                },
                take: 3,
                order: {
                    observedAt: "DESC"
                }
            })

            if (last3Attempts.length >= 3 && !sectionContent.quiz.isPassed) {
                const earliestAttempt = last3Attempts.at(2)
                const timeWait = Date.now() - earliestAttempt.observedAt.getTime()
                if (timeWait < 1000 * 60 * 60 * 8) {
                    sectionContent.quiz.blockAttempt = true
                    sectionContent.quiz.blockAttemptTimeWait = new Date(earliestAttempt.observedAt.getTime() +  1000 * 60 * 60 * 8)
                } 
            } 
            break
        }
        case SectionContentType.Resource: {
            const resource = await this.resourceMySqlRepository.findOne({
                where: {
                    resourceId: sectionContentId,
                },
                relations: {
                    attachments: true,
                },
            })
            sectionContent.resource = resource

            const completeResource =
          await this.completeResourceMySqlRepository.findOne({
              where: {
                  accountId,
                  resourceId: sectionContent.sectionContentId!,
              },
          })
            if (!completeResource) {
                sectionContent.completeState = CompleteState.Undone
            } else {
                sectionContent.completeState = CompleteState.Completed
            }
            break
        }
        }

        const creatorFollow = await this.followMySqlRepository.find({
            where: {
                followedAccountId: sectionContent.section.course.creator.accountId,
                followed: true,
            },
        })

        sectionContent.section.course.creator.numberOfFollowers =
      creatorFollow.length

        sectionContent.section.course.creator.followed = creatorFollow.some(
            (followed) => followed.followerId === accountId,
        )

        const promises: Array<Promise<void>> = []
        for (const section of sectionContent.section.course.sections) {
            for (const content of section.contents) {
                const promise = async () => {
                    //quiz based
                    switch (content.type) {
                    case SectionContentType.Quiz: {
                        const attempts = await this.quizAttemptMySqlRepository.find({
                            where: {
                                quizId: content.quizId,
                                accountId,
                            },
                        })
                        if (!attempts.length) {
                            content.completeState = CompleteState.Undone
                            break
                        }

                        const doneAttempt = attempts.find(
                            ({ attemptStatus }) =>
                                attemptStatus === QuizAttemptStatus.Ended,
                        )
                        if (!doneAttempt) {
                            content.completeState = CompleteState.Undone
                            break
                        }

                        const found = attempts.find((attempt) => attempt.isPassed)

                        content.completeState = found
                            ? CompleteState.Completed
                            : CompleteState.Failed
                        break
                    }
                    case SectionContentType.Lesson: {
                        const found = await this.progressMySqlRepository.findOne({
                            where: {
                                lessonId: content.sectionContentId,
                                accountId,
                                completeFirstWatch: true,
                            },
                        })

                        content.completeState = found
                            ? CompleteState.Completed
                            : CompleteState.Undone
                        break
                    }
                    case SectionContentType.Resource: {
                        const completeResource =
                await this.completeResourceMySqlRepository.findOne({
                    where: {
                        accountId,
                        resourceId: content.sectionContentId!,
                    },
                })
                        if (!completeResource) {
                            content.completeState = CompleteState.Undone
                        } else {
                            content.completeState = CompleteState.Completed
                        }
                    }
                    }
                }
                promises.push(promise())
            }
        }
        await Promise.all(promises)

        const sections = Object.assign(sectionContent.section.course.sections, [])
        sections.sort((prev, next) => prev.position - next.position)

        for (const section of sections) {
            section.lockState = LockState.Locked
        }

        sectionContent.section.course.certificateStatus = CertificateStatus.Cannot

        for (let i = 0; i < sections.length; i++) {
            sections[i].lockState = LockState.InProgress
            let allCompleted = true
            for (const content of sections[i].contents) {
                if (content.completeState !== CompleteState.Completed) {
                    allCompleted = false
                    break
                }
            }

            if (allCompleted) {
                sections[i].lockState = LockState.Completed
                if (i === sections.length - 1) {
                    const certificate = await this.certificateMySqlRepository.findOne({
                        where: {
                            courseId: sectionContent.section.course.courseId,
                            accountId,
                        },
                    })
                    sectionContent.section.course.certificateStatus = certificate
                        ? CertificateStatus.Gotten
                        : CertificateStatus.Getable
                }
            } else {
                break
            }
        }

        const certificate = await this.certificateMySqlRepository.findOne({
            where: {
                courseId: sectionContent.section.course.courseId,
                accountId,
            },
        })

        sectionContent.section.course.certificate = certificate
        sectionContent.section.course.sections = sections

        return sectionContent
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

        const pendingReports = await this.reportCourseMySqlRepository.find({
            where: {
                processStatus: ReportProcessStatus.Processing
            },
            relations: {
                reporterAccount: true,
                reportedCourse: {
                    creator: true
                }
            },
            order: {
                createdAt: "DESC"
            }
        })

        const exceptPendingReports = await this.reportCourseMySqlRepository.find({
            where: {
                processStatus: Not(ReportProcessStatus.Processing)
            },
            relations: {
                reporterAccount: true,
                reportedCourse: {
                    creator: true
                }
            },
            order: {
                createdAt: "DESC"
            }
        })

        const results = [...pendingReports, ...exceptPendingReports]

        if(skip !== undefined && take !== undefined){
            results.slice(skip, skip + take)
        }

        const numberOfCourseReports = await this.reportCourseMySqlRepository.count()

        const promises: Array<Promise<void>> = []
        for (const {reportedCourse} of results) {
            const promise = async () => {
                const courseReviews = await this.courseReviewMySqlRepository.find({
                    where: {
                        courseId: reportedCourse.courseId,
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

                reportedCourse.courseRatings = courseRatings

                reportedCourse.numberOfReports = await this.reportCourseMySqlRepository.count({
                    where:{
                        courseId: reportedCourse.courseId
                    }
                })
            }
            promises.push(promise())
        }
        await Promise.all(promises)

        return {
            results,
            metadata: {
                count: numberOfCourseReports,
            },
        }
    }

    async findManyQuizAttempts(
        input: FindManyQuizAttemptsInput,
    ): Promise<FindManyQuizAttemptsOutputData> {
        const { data, accountId } = input
        const { params, options } = data
        const { quizId } = params
        const { skip, take } = options

        const results = await this.quizAttemptMySqlRepository.find({
            where: {
                accountId,
                quizId,
                attemptStatus: QuizAttemptStatus.Ended,
            },
            skip,
            take,
            relations: {
                quiz: {
                    questions: {
                        answers: true,
                    },
                },
                attemptAnswers: {
                    quizQuestionAnswer: true,
                },
            },
            order: {
                observedAt: "DESC",
            },
        })

        for (const attempt of results) {
            const { quiz, attemptAnswers } = attempt
            const { questions } = quiz

            let numberOfQuestionsAnswered = 0
            for (const question of questions) {
                const { answers } = question

                let questionCorrected = false

                answers.forEach((answer) => {
                    const selectedAttemptAnswer = attemptAnswers?.find(
                        (attemptAnswer) =>
                            attemptAnswer.quizQuestionAnswerId ===
              answer.quizQuestionAnswerId,
                    )

                    answer.selected = !!selectedAttemptAnswer

                    if (selectedAttemptAnswer) {
                        numberOfQuestionsAnswered++
                        selectedAttemptAnswer.corrected = answer.isCorrect
                        if (answer.isCorrect) {
                            questionCorrected = true
                        }
                    }
                })

                question.corrected = questionCorrected
            }
            quiz.isPassed = attempt.receivedPercent >= quiz.passingPercent
            attempt.numberOfQuestionAnswered = numberOfQuestionsAnswered
        }

        const numberOfAttempts = await this.quizAttemptMySqlRepository.count({
            where: {
                accountId,
                quizId,
            },
        })

        return {
            results,
            metadata: {
                count: numberOfAttempts,
            },
        }
    }
}
