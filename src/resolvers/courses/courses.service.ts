import {
    CategoryMySqlEntity,
    CourseMySqlEntity,
    CourseReviewMySqlEntity,
    CourseTargetMySqlEntity,
    EnrolledInfoMySqlEntity,
    FollowMySqlEnitity,
    LectureMySqlEntity,
    ResourceMySqlEntity,
    TopicMySqlEntity
} from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DataSource, Like } from "typeorm"
import {
    FindOneCourseInput,
    FindManyCoursesInput,
    FindManyLecturesInput,
    FindManyResourcesInput,
    FindOneLectureInput,
    FindManyCourseTargetsInput,
    FindOneCourseAuthInput,
    FindOneCourseReviewInput,
    FindManyCourseReviewsInput,
} from "./courses.input"
import { FindManyCourseReviewsOutputData, FindManyCoursesOutputData } from "./courses.output"
import { SubcategoryEntity } from "src/database/mysql/subcategory.entity"

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        @InjectRepository(LectureMySqlEntity)
        private readonly lectureMySqlRepository: Repository<LectureMySqlEntity>,
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
                    user: true,
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
        const { courseId, userId } = params

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const course = await this.courseMySqlRepository.findOne({
                where: { courseId },
                relations: {
                    sections: {
                        lectures: {
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

            const enrolledInfo = userId
                ? await this.enrolledInfoMySqlRepository.findOneBy({
                    courseId,
                    userId
                }) : undefined

            const numberOfFollowersResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(FollowMySqlEnitity, "follow")
                .where("followedUserId = :userId", { userId: course.creator.userId })
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
        const { data, userId } = input
        const { params } = data
        const { courseId } = params
        //console.log(data, userId)
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const course = await this.courseMySqlRepository.findOne({
                where: { courseId },
                relations: {
                    sections: {
                        lectures: {
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

            const enrolledInfo = userId
                ? await this.enrolledInfoMySqlRepository.findOneBy({
                    courseId,
                    userId
                }) : undefined

            const numberOfFollowersResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(FollowMySqlEnitity, "follow")
                .where("followedUserId = :userId", { userId: course.creator.userId })
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
                    topics
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findOneLecture(
        input: FindOneLectureInput,
    ): Promise<LectureMySqlEntity> {
        const { data, userId } = input
        const { params } = data
        const { lectureId } = params

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const lecture = await this.lectureMySqlRepository.findOne({
                where: { lectureId },
                relations: {
                    resources: true,
                    section: {
                        course: {
                            creator: true,
                            sections: {
                                lectures: true
                            }
                        }
                    }
                }
            })

            const follow = await queryRunner.manager.findOne(
                FollowMySqlEnitity,
                {
                    where: {
                        followerId: userId,
                        followedUserId: lecture.section.course.creator.userId,
                        followed: true,
                    }
                }
            )

            const numberOfFollowers = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(FollowMySqlEnitity, "follow")
                .where("followedUserId = :userId", { userId: lecture.section.course.creator.userId })
                .andWhere("followed = :followed", { followed: true })
                .getRawOne()

            await queryRunner.commitTransaction()

            lecture.section.course.creator.numberOfFollowers = numberOfFollowers.count
            lecture.section.course.creator.followed = follow ? follow.followed : false

            return lecture
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findManyLectures(
        input: FindManyLecturesInput,
    ): Promise<Array<LectureMySqlEntity>> {
        const { data } = input
        const { params } = data
        const { sectionId } = params

        return await this.lectureMySqlRepository.find({
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
        const { lectureId } = params

        return await this.resourceMySqlRepository.find({
            where: {
                lectureId
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
                    lectures: {
                        resources: true
                    }
                },
                posts: {
                    course: true
                }
            }
        })
    }
}
