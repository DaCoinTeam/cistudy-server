import {
    CategoryMySqlEntity,
    CourseMySqlEntity,
    CourseReviewMySqlEntity,
    CourseTargetMySqlEntity,
    EnrolledInfoMySqlEntity,
    FollowMySqlEnitity,
    LessonMySqlEntity,
    QuizAttemptMySqlEntity,
    ResourceMySqlEntity,
    TopicMySqlEntity
} from "@database"
import { Injectable } from "@nestjs/common"
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
} from "./courses.input"
import { FindManyCourseReviewsOutputData, FindManyCoursesOutputData, FindManyCoursesTopicOutputData } from "./courses.output"
import { SubcategoryEntity } from "src/database/mysql/subcategory.entity"

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
        @InjectRepository(SubcategoryEntity)
        private readonly subcategoryMySqlRepository: Repository<SubcategoryEntity>,
        @InjectRepository(TopicMySqlEntity)
        private readonly topicMySqlRepository: Repository<TopicMySqlEntity>,
        @InjectRepository(CourseReviewMySqlEntity)
        private readonly courseReviewMySqlRepository: Repository<CourseReviewMySqlEntity>,
        @InjectRepository(EnrolledInfoMySqlEntity)
        private readonly enrolledInfoMySqlRepository: Repository<EnrolledInfoMySqlEntity>,
        @InjectRepository(QuizAttemptMySqlEntity)
        private readonly quizAttemptMySqlRepository: Repository<QuizAttemptMySqlEntity>,

        private readonly dataSource: DataSource
    ) { }

    async findManyCourseReviews(input: FindManyCourseReviewsInput): Promise<FindManyCourseReviewsOutputData> {
        const { data } = input;
        const { params, options } = data;
        const { courseId } = params;
        const { skip, take } = options

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            console.log(courseId)
            const results = await this.courseReviewMySqlRepository.find({
                where: { courseId },
                relations: {
                    course: true,
                    account: true,
                },
                skip,
                take,
                order: { createdAt: 'DESC' }
            });
            console.log(results.length)
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
                    courseSubcategories: {
                        subcategory: {
                            subcategoryTopics: {
                                topic: true
                            }
                        }
                    },
                    category: true,
                    courseTopics: {
                        topic: true
                    }
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
                .where("followedUserId = :accountId", { accountId: course.creator.accountId })
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
                    courseSubcategories: {
                        subcategory: {
                            subcategoryTopics: {
                                topic: true
                            }
                        }
                    },
                    category: true,
                    courseTopics: {
                        topic: true
                    }
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
                .where("followedUserId = :accountId", { accountId: course.creator.accountId })
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
        const { skip, take, searchValue } = { ...options }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const categories = await this.categoryMySqlRepository.find(
                {
                    where: {
                        name: searchValue ? Like(`%${searchValue}%`) : undefined
                    }
                })

            const subcategories = await this.subcategoryMySqlRepository.find(
                {
                    where: {
                        name: searchValue ? Like(`%${searchValue}%`) : undefined
                    }
                })

            const topics = await this.topicMySqlRepository.find(
                {
                    where: {
                        name: searchValue ? Like(`%${searchValue}%`) : undefined
                    },
                    relations: {
                        courseTopics: true
                    }
                })


            const results = await this.courseMySqlRepository.find(
                {
                    where: {
                        title: Like(`%${searchValue}%`)
                    },
                    skip,
                    take,
                    relations: {
                        creator: true,
                    },
                })

            const coursesReviews = await this.courseReviewMySqlRepository.find({
                where: {
                    courseId: In(results.map(course => course.courseId))
                },
            });

            results.forEach(course => {
                const reviews = coursesReviews.filter(review => review.courseId === course.courseId);
                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                course.courseRate = reviews.length ? (totalRating / reviews.length) : 0;
            });

            const maxRate = Math.max(...results.map(course => course.courseRate));
            const highRateCourses = results.filter(course => course.courseRate === maxRate);

            const numberOfCoursesResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(CourseMySqlEntity, "course")
                .getRawOne()

            await queryRunner.commitTransaction()

            return {
                results,
                metadata: {
                    count: numberOfCoursesResult.count,
                    categories,
                    subcategories,
                    topics,
                    highRateCourses
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
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
                        }
                    }
                }
            })

            const follow = await queryRunner.manager.findOne(
                FollowMySqlEnitity,
                {
                    where: {
                        followerId: accountId,
                        followedUserId: lesson.section.course.creator.accountId,
                        followed: true,
                    }
                }
            )

            const numberOfFollowers = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(FollowMySqlEnitity, "follow")
                .where("followedUserId = :accountId", { accountId: lesson.section.course.creator.accountId })
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

    async findManyCategories(
    ): Promise<Array<CategoryMySqlEntity>> {
        return await this.categoryMySqlRepository.find({
            relations: {
                subcategories: {
                    subcategoryTopics: {
                        topic: true
                    }
                }
            },
        })
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
        const { data } = input;
        const { params, options } = data;
        const { topicId } = params;
        const { take, skip } = { ...options };

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const results = await queryRunner.manager
                .createQueryBuilder(CourseMySqlEntity, "course")
                .innerJoinAndSelect("course.courseTopics", "course_topic")
                .where("course_topic.topicId = :topicId", { topicId })
                .skip(skip)
                .take(take)
                .getMany();

            const numberOfCoursesTopicResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(course.courseId)", "count")
                .from(CourseMySqlEntity, "course")
                .innerJoin("course.courseTopics", "course_topic")
                .where("course_topic.topicId = :topicId", { topicId })
                .getRawOne();

            await queryRunner.commitTransaction();

            return {
                results,
                metadata: {
                    count: numberOfCoursesTopicResult.count,
                }
            };
        } catch (ex) {
            await queryRunner.rollbackTransaction();
            throw ex;
        } finally {
            await queryRunner.release();
        }
    }

    async findOneQuizAttempt(input: FindOneQuizAttemptInput): Promise<QuizAttemptMySqlEntity> {
        const { accountId, data } = input
        const { quizAttemptId } = data
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
        //console.log(found.quiz.questions)
        return found
    }
}
