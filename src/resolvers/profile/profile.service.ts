import { CourseMySqlEntity, EnrolledInfoMySqlEntity, FollowMySqlEnitity, LectureMySqlEntity, ProgressMySqlEntity, SectionMySqlEntity, UserMySqlEntity } from "@database"
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
        const { data, userId } = input;
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
                        lectures: true
                    }
                },
                take,
                skip,
                where: {
                    enrolledInfos: {
                        userId,
                        enrolled: true
                    }
                }
            });
    
          
            const numberOfFollowersResults = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(follow.followerId)", "count")
                .addSelect("course.courseId", "courseId")
                .from(CourseMySqlEntity, "course")
                .innerJoin(UserMySqlEntity, "user", "course.creatorId = user.userId")
                .innerJoin(FollowMySqlEnitity, "follow", "user.userId = follow.followerId")
                .where("followed = :followed", { followed: true })
                .groupBy("course.courseId")
                .getRawMany();
    
            
            const numberOfEnrolledCoursesResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(CourseMySqlEntity, "course")
                .innerJoin(EnrolledInfoMySqlEntity, "enrolledInfo", "course.courseId = enrolledInfo.courseId")
                .where("enrolledInfo.userId = :userId", { userId })
                .andWhere("enrolledInfo.enrolled = :enrolled", { enrolled: true })
                .getRawOne();
    
            
            const progressResults = await queryRunner.manager
                .createQueryBuilder()
                .select("course.courseId", "courseId")
                .addSelect("COUNT(progress.lectureId)", "completedLectures")
                .addSelect("COUNT(DISTINCT lecture.lectureId)", "totalLectures")
                .from(ProgressMySqlEntity, "progress")
                .innerJoin(LectureMySqlEntity, "lecture", "progress.lectureId = lecture.lectureId")
                .innerJoin(SectionMySqlEntity, "section", "lecture.sectionId = section.sectionId")
                .innerJoin(CourseMySqlEntity, "course", "section.courseId = course.courseId")
                .where("progress.userId = :userId", { userId })
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
    
                    const totalLectures = course.sections.reduce((acc, section) => acc + section.lectures.length, 0);
                    const completedLectures = courseProgress?.completedLectures ?? 0;
                    const progress = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
    
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
