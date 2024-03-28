import { CourseMySqlEntity, FollowMySqlEnitity, UserMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { Repository, DataSource } from "typeorm"
import {
    FindManyEnrolledCoursesInput,
    FindManySelfCreatedCoursesInput,
} from "./profile.input"
import { InjectRepository } from "@nestjs/typeorm"
import { FindManyEnrolledCoursesOutputData, FindManySelfCreatedCoursesOutputData } from "./profile.output"

@Injectable()
export class ProfileService {
    constructor(
    @InjectRepository(CourseMySqlEntity)
    private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
    private readonly dataSource: DataSource,
    ) {}

    async findManySelfCreatedCourses(
        input: FindManySelfCreatedCoursesInput,
    ): Promise<FindManySelfCreatedCoursesOutputData> {
        const { data, userId } = input
        const { options } = data
        const { take, skip } = { ...options }
        
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
 
        try {
            const courses =  await this.courseMySqlRepository.find({
                where: {
                    creatorId: userId,
                },
                take,
                skip,
            })
            
            const numberOfCoursesResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(CourseMySqlEntity, "course")
                .where("creatorId = :creatorId", { creatorId: userId })
                .getRawOne()

            await queryRunner.commitTransaction()

            return {
                results: courses,
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
    
    async findManyEnrolledCourses(input: FindManyEnrolledCoursesInput): Promise<FindManyEnrolledCoursesOutputData> {
        const { data, userId } = input
        const { options } = data
        const { take, skip } = { ...options }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const courses = await this.courseMySqlRepository.find(
                {
                    relations: {
                        creator: true,
                        enrolledInfos: true
                    },
                    take,
                    skip,
                    where: {
                        enrolledInfos: {
                            userId,
                            enrolled: true
                        }
                    }
                }
            )

            const numberOfFollowersResults = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(follow.followerId)", "count")
                .addSelect("course.courseId", "courseId")
                .from(CourseMySqlEntity, "course")
                .innerJoin(UserMySqlEntity, 
                    "user", "course.creatorId = user.userId")
                .innerJoin(FollowMySqlEnitity,
                    "follow", "user.userId = follow.followerId"
                )
                .where("followed = :followed", { followed: true })
                .groupBy("course.courseId")
                .getRawMany()
  
            const numberOfEnrolledCouresResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(CourseMySqlEntity, "course")
                .getRawOne()

            await queryRunner.commitTransaction()
            return {
                results : courses.map(course => {
                    const numberOfFollowers = numberOfFollowersResults.find(
                        result => result.courseId === course.courseId,
                    )?.count ?? 0

                    course.creator.numberOfFollowers = numberOfFollowers
                    return course
                }),
                metadata: {
                    count : numberOfEnrolledCouresResult.count
                }
            }
        } catch (ex) {
            console.log(ex)
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }
}
