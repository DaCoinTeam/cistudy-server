import {
    CategoryMySqlEntity,
    CourseMySqlEntity,
    CourseTargetMySqlEntity,
    EnrolledInfoMySqlEntity,
    FollowMySqlEnitity,
    LectureMySqlEntity,
    ResourceMySqlEntity,
} from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DataSource } from "typeorm"
import {
    FindOneCourseInput,
    FindManyCoursesInput,
    FindManyLecturesInput,
    FindManyResourcesInput,
    FindOneLectureInput,
    FindManyCourseTargetsInput,
} from "./courses.input"
import { FindManyCoursesOutputData } from "./courses.output"

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
    private readonly dataSource: DataSource
    ) {}

    async findOneCourse(input: FindOneCourseInput): Promise<CourseMySqlEntity> {
        const { data } = input
        const { courseId } = data

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

            const numberOfFollowers = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(FollowMySqlEnitity, "follow")
                .where("followedUserId = :userId", { userId: course.creator.userId })
                .andWhere("followed = :followed", { followed: true })
                .getRawOne()

            const numberOfEnrollments = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(EnrolledInfoMySqlEntity, "enrolled_info")
                .andWhere("courseId = :courseId", { courseId })
                .getRawOne()

            await queryRunner.commitTransaction()

            course.creator.numberOfFollowers = numberOfFollowers.count
            course.numberOfEnrollments = numberOfEnrollments.count

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
        const { skip, take } = { ...options }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const results = await this.courseMySqlRepository.find(
                {
                    skip,
                    take,
                    relations: {
                        creator: true,
                    }
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
                    count: numberOfCoursesResult.count
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
                }})

            const follow = await queryRunner.manager.findOne(
                FollowMySqlEnitity,
                {
                    where: {
                        followerId: userId,
                        followedUserId: lecture.section.course.creator.userId,
                        followed: true
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
        return await this.lectureMySqlRepository.find({
            where: data,
            relations: {
                resources: true,
            },
        })
    }

    async findManyResources(
        input: FindManyResourcesInput,
    ): Promise<Array<ResourceMySqlEntity>> {
        const { data } = input
        return await this.resourceMySqlRepository.find({
            where: data,
        })
    }

    async findManyCourseTargets(
        input: FindManyCourseTargetsInput,
    ): Promise<Array<CourseTargetMySqlEntity>> {
        const { data } = input
        return await this.courseTargetMySqlRepository.find({
            where: data,
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

}
