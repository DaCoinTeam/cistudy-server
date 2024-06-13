import { CourseMySqlEntity, EnrolledInfoMySqlEntity, FollowMySqlEnitity, LessonMySqlEntity, ProgressMySqlEntity, SectionMySqlEntity, AccountMySqlEntity } from "@database"
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
        const { data, accountId } = input
        const { options } = data
        const { take, skip } = { ...options }
        
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
 
        try {
            const courses =  await this.courseMySqlRepository.find({
                where: {
                    creatorId: accountId,
                },
                take,
                skip,
            })
            
            const numberOfCoursesResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(CourseMySqlEntity, "course")
                .where("creatorId = :creatorId", { creatorId: accountId })
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
        const { data, accountId } = input;
        const { options } = data;
        const { take, skip } = { ...options };
    
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
            
            const courses = await this.courseMySqlRepository.find({
                relations: {
                    creator: true,
                    enrolledInfos: true,
                    sections: {
                        lessons: true
                    }
                },
                take,
                skip,
                where: {
                    enrolledInfos: {
                        accountId,
                        enrolled: true
                    }
                }
            });
    
          
            const numberOfFollowersResults = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(follow.followerId)", "count")
                .addSelect("course.courseId", "courseId")
                .from(CourseMySqlEntity, "course")
                .innerJoin(AccountMySqlEntity, "account", "course.creatorId = account.accountId")
                .innerJoin(FollowMySqlEnitity, "follow", "account.accountId = follow.followerId")
                .where("followed = :followed", { followed: true })
                .groupBy("course.courseId")
                .getRawMany();
    
            
            const numberOfEnrolledCoursesResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(CourseMySqlEntity, "course")
                .innerJoin(EnrolledInfoMySqlEntity, "enrolledInfo", "course.courseId = enrolledInfo.courseId")
                .where("enrolledInfo.accountId = :accountId", { accountId })
                .andWhere("enrolledInfo.enrolled = :enrolled", { enrolled: true })
                .getRawOne();
    
            
            const progressResults = await queryRunner.manager
                .createQueryBuilder()
                .select("course.courseId", "courseId")
                .addSelect("COUNT(progress.lessonId)", "completedLessons")
                .addSelect("COUNT(DISTINCT lesson.lessonId)", "totalLessons")
                .from(ProgressMySqlEntity, "progress")
                .innerJoin(LessonMySqlEntity, "lesson", "progress.lessonId = lesson.lessonId")
                .innerJoin(SectionMySqlEntity, "section", "lesson.sectionId = section.sectionId")
                .innerJoin(CourseMySqlEntity, "course", "section.courseId = course.courseId")
                .where("progress.accountId = :accountId", { accountId })
                .andWhere("progress.isCompleted = :isCompleted", { isCompleted: true })
                .groupBy("course.courseId")
                .getRawMany();
    
            await queryRunner.commitTransaction();
            return {
                results: courses.map(course => {
                    const numberOfFollowers = numberOfFollowersResults.find(
                        result => result.courseId === course.courseId,
                    )?.count ?? 0;
    
                    const courseProgress = progressResults.find(
                        result => result.courseId === course.courseId
                    );
    
                    const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
                    const completedLessons = courseProgress?.completedLessons ?? 0;
                    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    
                    course.creator.numberOfFollowers = numberOfFollowers;
                    course.courseProgress = progress;
    
                    return course;
                }),
                metadata: {
                    count: numberOfEnrolledCoursesResult.count
                }
            };
        } catch (ex) {
            console.log(ex);
            await queryRunner.rollbackTransaction();
            throw ex;
        } finally {
            await queryRunner.release();
        }
    }
    
}
