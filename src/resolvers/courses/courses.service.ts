import {
    CategoryMySqlEntity,
    CategoryRelationMySqlEntity,
    CourseCategoryMySqlEntity,
    CourseMySqlEntity,
    CourseReviewMySqlEntity,
    CourseTargetMySqlEntity,
    EnrolledInfoMySqlEntity,
    FollowMySqlEnitity,
    LessonMySqlEntity,
    QuizAttemptMySqlEntity,
    QuizQuestionMySqlEntity,
    ReportCourseMySqlEntity,
    ResourceMySqlEntity
} from "@database"
import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DataSource, Like, In } from "typeorm"
import {
    FindOneCourseInput,
    FindManyCoursesInput,
    FindManyLessonsInput,
    FindManyResourcesInput,
    FindOneLessonInput,
    FindManyCourseTargetsInput,
    FindOneCourseAuthInput,
    FindOneCourseReviewInput,
    FindManyCourseReviewsInput,
    FindManyCoursesTopicInput,
    FindOneQuizAttemptInput,
    FindManyLevelCategoriesInput,
    FindManyCourseReportsInput,
} from "./courses.input"
import { FindManyCourseReportsOutputData, FindManyCourseReviewsOutputData, FindManyCoursesOutputData, FindManyCoursesTopicOutputData, FindOneQuizAttemptOutput } from "./courses.output"
import { CourseVerifyStatus } from "@common"

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        @InjectRepository(LessonMySqlEntity)
        private readonly lessonMySqlRepository: Repository<LessonMySqlEntity>,
        @InjectRepository(ResourceMySqlEntity)
        private readonly resourceMySqlRepository: Repository<ResourceMySqlEntity>,
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
        @InjectRepository(CourseCategoryMySqlEntity)
        private readonly courseCategoryMySqlRepository: Repository<CourseCategoryMySqlEntity>,
        @InjectRepository(QuizQuestionMySqlEntity)
        private readonly quizQuestionMySqlRepository: Repository<QuizQuestionMySqlEntity>,
        @InjectRepository(ReportCourseMySqlEntity)
        private readonly reportCourseMySqlRepository: Repository<ReportCourseMySqlEntity>,

        private readonly dataSource: DataSource
    ) { }

    async findManyCourseReviews(input: FindManyCourseReviewsInput): Promise<FindManyCourseReviewsOutputData> {
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
                order: { createdAt: "DESC" }
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
                }
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
                        lessons: {
                            resources: true,
                        },
                    },
                    courseTargets: true,
                    creator: true,
                    courseCategories:{
                        category: true
                    }
                },
                order: {
                    courseTargets: {
                        position: "ASC",
                    },
                    courseCategories:{
                        category:{
                            level: "ASC"
                        }
                    }
                },
            })

            const enrolledInfo = accountId
                ? await this.enrolledInfoMySqlRepository.findOneBy({
                    courseId,
                    accountId
                }) : undefined

            const numberOfFollowersResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(FollowMySqlEnitity, "follow")
                .where("followedAccountId = :accountId", { accountId: course.creator.accountId })
                .andWhere("followed = :followed", { followed: true })
                .getRawOne()

            const numberOfEnrollmentsResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(EnrolledInfoMySqlEntity, "enrolled_info")
                .andWhere("courseId = :courseId", { courseId })
                .getRawOne()

            const courseReviews = await this.courseReviewMySqlRepository.findBy({courseId})
            
            const ratingCounts = [1, 2, 3, 4, 5].map(star => 
                courseReviews.filter(review => review.rating === star).length
            )

            await queryRunner.commitTransaction()

            course.creator.numberOfFollowers = numberOfFollowersResult.count
            course.numberOfEnrollments = numberOfEnrollmentsResult.count

            const enrolled = enrolledInfo?.enrolled
            course.enrolled = enrolled ?? false

            const totalRating = courseReviews.reduce((sum, review) => sum + review.rating, 0)
            const overallCourseRating = courseReviews.length ? totalRating / courseReviews.length : 0
            
            course.courseRatings = {
                overallCourseRating,
                numberOf1StarRatings: ratingCounts[0],
                numberOf2StarRatings: ratingCounts[1],
                numberOf3StarRatings: ratingCounts[2],
                numberOf4StarRatings: ratingCounts[3],
                numberOf5StarRatings: ratingCounts[4],
            }

            return course
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findOneCourseAuth(input: FindOneCourseAuthInput): Promise<CourseMySqlEntity> {
        const { data, accountId } = input
        const { params } = data
        const { courseId } = params
        //console.log(data, accountId)
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const course = await this.courseMySqlRepository.findOne({
                where: { courseId },
                relations: {
                    sections: {
                        lessons: {
                            resources: true,
                        },
                    },
                    courseTargets: true,
                    creator: true,
                },
                order: {
                    courseTargets: {
                        position: "ASC",
                    },
                },
            })

            const enrolledInfo = accountId
                ? await this.enrolledInfoMySqlRepository.findOneBy({
                    courseId,
                    accountId
                }) : undefined

            const numberOfFollowersResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(FollowMySqlEnitity, "follow")
                .where("followedAccountId = :accountId", { accountId: course.creator.accountId })
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

            const enrolled = enrolledInfo?.enrolled
            course.enrolled = enrolled ?? false

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
        const { skip, take, searchValue, categoryId } = { ...options }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            let results = []

            if (categoryId) {
                const category = await this.categoryMySqlRepository.findOne({ where: { categoryId } })

                if (!category) {
                    throw new NotFoundException("Category not found")
                }

                const currentcategoryLevel = category.level

                switch (currentcategoryLevel) {
                case 0: {
                    const { categoryId } = category
                    const level0Category = await this.categoryMySqlRepository.findOne({
                        where: { categoryId },
                        relations: {
                            categoryParentRelations: {
                                category: {//lv1
                                    categoryParentRelations: {
                                        category: {//lv2
                                            courseCategories: {
                                                course: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                    const level2Categories = level0Category?.categoryParentRelations?.flatMap(
                        lv1 => lv1.category?.categoryParentRelations?.map(
                            lv2 => lv2.category
                        ) || []
                    ) || []

                    results = level2Categories.flatMap(cat =>
                        cat.courseCategories
                            .filter(cc => cc.course?.title?.toLowerCase().includes(searchValue.toLowerCase()))
                            .map(cc => cc.course)
                    ).slice(skip, take)
                    break
                }
                case 1: {
                    const { categoryId } = category

                    const level1Categories = await this.categoryMySqlRepository.findOne({
                        where: {
                            categoryId
                        },
                        relations: {
                            categoryParentRelations: {
                                category: {
                                    courseCategories: {
                                        course: true
                                    }
                                }
                            }
                        }
                    })

                    results = level1Categories.categoryParentRelations.flatMap(cat =>
                        cat.category?.courseCategories?.filter(
                            cc => cc.course?.title?.toLowerCase().includes(searchValue.toLowerCase())
                        )
                            .map(cc => cc.course)
                    ).slice(skip, take)
                    break
                }
                case 2: {
                    results = await this.courseMySqlRepository.find({
                        where: {
                            courseCategories: {
                                categoryId: categoryId,
                            },
                            title: Like(`%${searchValue}%`),
                        },
                        relations: {
                            creator: true,
                            courseCategories: {
                                category: true,
                            },
                        },
                        skip,
                        take,
                    })
                    break
                }
                default: break
                }
            } else {
                results = await this.courseMySqlRepository.find({
                    where: {
                        title: Like(`%${searchValue}%`),
                        verifyStatus: CourseVerifyStatus.Approved
                    },
                    skip,
                    take,
                    relations: {
                        creator: true,
                        courseCategories: {
                            category: true,
                        },
                        sections:{
                            lessons: true
                        }
                    },
                })
            }


            const topic = await this.categoryMySqlRepository.find({
                where: {
                    level: 2,
                    name: Like(`%${searchValue}%`),
                },
            })


            const coursesReviews = await this.courseReviewMySqlRepository.find({
                where: {
                    courseId: In(results.map(course => course.courseId)),
                },
            })

            results.forEach(async course => {
                const reviews = coursesReviews.filter(review => review.courseId === course.courseId)
                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
                const ratingCounts = [1, 2, 3, 4, 5].map(star => 
                    reviews.filter(review => review.rating === star).length
                )
                const overallCourseRating = reviews.length ? totalRating / reviews.length : 0
                
                course.courseRatings = {
                    overallCourseRating,
                    numberOf1StarRatings: ratingCounts[0],
                    numberOf2StarRatings: ratingCounts[1],
                    numberOf3StarRatings: ratingCounts[2],
                    numberOf4StarRatings: ratingCounts[3],
                    numberOf5StarRatings: ratingCounts[4],
                }

                // const courseCategories = await this.courseCategoryMySqlRepository.find({
                //     where:{
                //         courseId : course.courseId
                //     },
                //     relations: {
                //         category: true
                //     }
                // })

                // const categoryLevels = courseCategories.map(category => 
                //     category.category.level = 
                // )
                // course.courseCategoryLevels = {

                // }
            })

            const maxRate = Math.max(...results.map(course => course.courseRatings.overallCourseRating))
            const highRateCourses = results.filter(course => course.courseRatings.overallCourseRating === maxRate)

            await queryRunner.commitTransaction()

            return {
                results,
                metadata: {
                    count: results.length,
                    highRateCourses,
                    categories: topic,
                },
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }


    async findOneLesson(
        input: FindOneLessonInput,
    ): Promise<LessonMySqlEntity> {
        const { data, accountId } = input
        const { params } = data
        const { lessonId } = params

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const lesson = await this.lessonMySqlRepository.findOne({
                where: { lessonId },
                relations: {
                    resources: true,
                    section: {
                        course: {
                            creator: true,
                            sections: {
                                lessons: true
                            }
                        },

                    },
                    quiz: {
                        questions: {
                            questionMedias: true,
                            answers: true
                        }
                    }
                }
            })

            const follow = await queryRunner.manager.findOne(
                FollowMySqlEnitity,
                {
                    where: {
                        followerId: accountId,
                        followedAccountId: lesson.section.course.creator.accountId,
                        followed: true,
                    }
                }
            )

            const numberOfFollowers = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(FollowMySqlEnitity, "follow")
                .where("followedAccountId = :accountId", { accountId: lesson.section.course.creator.accountId })
                .andWhere("followed = :followed", { followed: true })
                .getRawOne()

            await queryRunner.commitTransaction()

            lesson.section.course.creator.numberOfFollowers = numberOfFollowers.count
            lesson.section.course.creator.followed = follow ? follow.followed : false

            return lesson
        } catch (ex) {
            await queryRunner.rollbackTransaction()
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

        return await this.lessonMySqlRepository.find({
            where: {
                sectionId
            },

            relations: {
                resources: true,
                quiz: {
                    questions: {
                        questionMedias: true,
                        answers: true
                    }
                }
            },

        })


    }

    async findManyResources(
        input: FindManyResourcesInput,
    ): Promise<Array<ResourceMySqlEntity>> {
        const { data } = input
        const { params } = data
        const { lessonId } = params

        return await this.resourceMySqlRepository.find({
            where: {
                lessonId
            },
        })
    }

    async findManyCourseTargets(
        input: FindManyCourseTargetsInput,
    ): Promise<Array<CourseTargetMySqlEntity>> {
        const { data } = input
        const { params } = data
        const { courseId } = params

        return await this.courseTargetMySqlRepository.find({
            where: {
                courseId
            },
        })
    }

    async findManyCategories() : Promise<Array<CategoryMySqlEntity>>{
        const results = await this.categoryMySqlRepository.find({
            where:{
                level: 0
            },
            relations:{
                categoryParentRelations:{
                    category:{
                        categoryParentRelations:{
                            category: true
                        }
                    }
                }
            }
        })
        return results
    }

    async findManyLevelCategories(
        input: FindManyLevelCategoriesInput,
    ): Promise<Array<CategoryMySqlEntity>> {
        const { data } = input
        const { categoryParentId } = data
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            let childCategories = []

            if (categoryParentId) {
                const parentCategory = await this.categoryMySqlRepository.findOne({
                    where: { categoryId: categoryParentId },
                })

                if (!parentCategory) {
                    throw new NotFoundException("Parent category not found")
                }

                childCategories = await queryRunner.manager
                    .createQueryBuilder()
                    .select("category")
                    .from(CategoryMySqlEntity, "category")
                    .innerJoin(CategoryRelationMySqlEntity, "categoryRelation", "category.categoryId = categoryRelation.categoryId")
                    .where("categoryRelation.categoryParentId = :categoryParentId", { categoryParentId })
                    .getMany()
            } else {
                childCategories = await this.categoryMySqlRepository.find({
                    where: {
                        level: 0
                    }
                })
            }

            await queryRunner.commitTransaction()
            return childCategories
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    async findOneCourseReview(
        input: FindOneCourseReviewInput,
    ) {
        const { data } = input
        const { params } = data
        const { courseId } = params

        return await this.courseMySqlRepository.findOne({
            where: {
                courseId
            },
            relations: {
                creator: true,
                sections: {
                    lessons: {
                        resources: true
                    }
                },
                posts: {
                    course: true
                }
            }
        })
    }

    async findManyCoursesTopic(input: FindManyCoursesTopicInput): Promise<FindManyCoursesTopicOutputData> {
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
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    async findOneQuizAttempt(input: FindOneQuizAttemptInput): Promise<FindOneQuizAttemptOutput> {
        const { accountId, data } = input
        const { params, options } = data
        const { quizAttemptId } = params
        const { skip, take } = options

        const found = await this.quizAttemptMySqlRepository.findOne({
            where: {
                accountId, quizAttemptId
            },
            relations: {
                questionAnswers: true,
                quiz: {
                    questions: {
                        answers: true
                    }
                }
            }
        })
        if (!found) {
            throw new NotFoundException("Attempt not found or not started by user")
        }
        const { quizId } = found
        const quizQuestions = await this.quizQuestionMySqlRepository.find({
            where: {
                quizId
            },
            skip,
            take,
            relations: {
                answers: true
            }
        })

        found.quiz.questions = quizQuestions

        return {
            data: found,
            numberOfQuestions: quizQuestions.length
        }
    }

    async findManyCourseReports(input: FindManyCourseReportsInput): Promise<FindManyCourseReportsOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = options

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const results = await this.reportCourseMySqlRepository.find({
                relations:{
                    reporterAccount: true,
                    reportedCourse: true,
                },
                skip,
                take
            })

            const numberOfCourseReports = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(ReportCourseMySqlEntity, "report-course")
                .getRawOne()

            return {
                results,
                metadata: {
                    count: numberOfCourseReports.count
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

}
