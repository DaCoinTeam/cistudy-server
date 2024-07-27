import { CompleteState } from "@common"
import { AccountMySqlEntity, CourseMySqlEntity, EnrolledInfoMySqlEntity, FollowMySqlEnitity, PostMySqlEntity, ProgressMySqlEntity, SectionContentMySqlEntity, SectionMySqlEntity, TransactionMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, Repository } from "typeorm"
import {
    FindManyEnrolledCoursesInput,
    FindManySelfCreatedCoursesInput,
    FindManyTransactionsInput,
} from "./profile.input"
import { FindManyEnrolledCoursesOutputData, FindManySelfCreatedCoursesOutputData, FindManyTransactionsOutputData } from "./profile.output"


@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        @InjectRepository(PostMySqlEntity)
        private readonly postMySqlRepository: Repository<PostMySqlEntity>,
        @InjectRepository(TransactionMySqlEntity)
        private readonly transactionMySqlRepository: Repository<TransactionMySqlEntity>,
        private readonly dataSource: DataSource,
    ) { }

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
            const courses = await this.courseMySqlRepository.find({
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
        const { data, accountId } = input
        const { options } = data
        const { take, skip } = { ...options }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const courses = await this.courseMySqlRepository.find({
                relations: {
                    creator: true,
                    enrolledInfos: true,
                    sections: {
                        contents:{
                            lesson: true
                        }
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
            })

            const numberOfFollowersResults = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(follow.followerId)", "count")
                .addSelect("course.courseId", "courseId")
                .from(CourseMySqlEntity, "course")
                .innerJoin(AccountMySqlEntity, "account", "course.creatorId = account.accountId")
                .innerJoin(FollowMySqlEnitity, "follow", "account.accountId = follow.followerId")
                .where("followed = :followed", { followed: true })
                .groupBy("course.courseId")
                .getRawMany()

            const numberOfEnrolledCoursesResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(CourseMySqlEntity, "course")
                .innerJoin(EnrolledInfoMySqlEntity, "enrolledInfo", "course.courseId = enrolledInfo.courseId")
                .where("enrolledInfo.accountId = :accountId", { accountId })
                .andWhere("enrolledInfo.enrolled = :enrolled", { enrolled: true })
                .getRawOne()

            const progressResults = await queryRunner.manager
                .createQueryBuilder()
                .select("course.courseId", "courseId")
                .addSelect("COUNT(progress.sectionContentId)", "completedContents")
                .addSelect("COUNT(DISTINCT progress.sectionContentId)", "totalContents")
                .from(ProgressMySqlEntity, "progress")
                .innerJoin(SectionContentMySqlEntity,"section_content", "progress.sectionContentId = section_content.sectionContentId")
                .innerJoin(SectionMySqlEntity, "section", "section_content.sectionId = section.sectionId")
                .innerJoin(CourseMySqlEntity, "course", "section.courseId = course.courseId")
                .innerJoin(EnrolledInfoMySqlEntity, "enrolledInfo", "progress.enrolledInfoId = enrolledInfo.enrolledInfoId")
                .where("enrolledInfo.accountId = :accountId", { accountId })
                .andWhere("progress.completeState = :completeState", { completeState: CompleteState.Completed })
                .groupBy("course.courseId")
                .getRawMany()
  
            const numberOfRewardedPosts = await this.postMySqlRepository.find({
                where: {
                    creatorId: accountId
                },
                order: {
                    createdAt: "ASC"
                }
            })

            const numberOfRewardedPostsLeft = 3 - Math.min(numberOfRewardedPosts.length, 3)

            await queryRunner.commitTransaction()
            return {
                results: courses.map(course => {
                    const numberOfFollowers = numberOfFollowersResults.find(
                        result => result.courseId === course.courseId,
                    )?.count ?? 0

                    const courseProgress = progressResults.find(
                        result => result.courseId === course.courseId
                    )

                    const totalLessons = course.sections.reduce((acc, section) => acc + section.contents.map(content => content.lesson).length, 0)
                    const completedLessons = courseProgress?.completedContents ?? 0
                    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

                    course.creator.numberOfFollowers = numberOfFollowers
                    course.courseProgress = progress
                    course.numberOfRewardedPostsLeft = numberOfRewardedPostsLeft

                    return course
                }),
                metadata: {
                    count: numberOfEnrolledCoursesResult.count
                }
            }
        } catch (ex) {
            console.log(ex)
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    // async findManySubmittedReports(input: FindManySubmittedReportsInput): Promise<FindManySubmittedReportsOutputData> {
    //     const { accountId, data } = input
    //     const { options } = data
    //     const { skip, take } = options
    //     const reports: ReportModel[] = []
    
    //     const reportTypes = [
    //         { type: ReportType.Account, repository: this.reportAccountMySqlRepository, additionalRelation: "reportedAccount", Id: "reportAccountId" },
    //         { type: ReportType.Course, repository: this.reportCourseMySqlRepository, additionalRelation: "reportedCourse", Id: "reportCourseId" },
    //         { type: ReportType.Post, repository: this.reportPostMySqlRepository, additionalRelation: "reportedPost", Id: "reportPostId" },
    //         { type: ReportType.PostComment, repository: this.reportPostCommentMySqlRepository, additionalRelation: "reportedPostComment", Id: "reportPostCommentId" }
    //     ]
    
    //     const fetchReports = async ({ type, repository, additionalRelation, Id }) => {
    //         const fetchedReports = await repository.find({
    //             where:{
    //                 reporterAccountId: accountId,
    //             },
    //             relations: {
    //                 reporterAccount: true,
    //                 [additionalRelation]: true
    //             }
    //         })
    
    //         reports.push(...fetchedReports.map(report => ({
    //             reportId: report[Id],
    //             type,
    //             reporterAccount: report.reporterAccount,
    //             reportedAccount: type === ReportType.Account ? report[additionalRelation] : null,
    //             reportedCourse: type === ReportType.Course ? report[additionalRelation] : null,
    //             reportedPost: type === ReportType.Post ? report[additionalRelation] : null,
    //             reportedPostComment: type === ReportType.PostComment ? report[additionalRelation] : null,
    //             description: report.description,
    //             processStatus: report.processStatus,
    //             processNote: report.processNote,
    //             createdAt: report.createdAt,
    //             updatedAt: report.updatedAt
    //         })))
            
    //     }
    
    //     await Promise.all(reportTypes.map(fetchReports))
    
    //     const slicedReports = (skip && take) ? reports.slice(skip, skip + take) : reports
    //     slicedReports?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    //     return {
    //         results: slicedReports,
    //         metadata: {
    //             count: slicedReports.length
    //         }
    //     }
    // } 

    async findManyTransactions(input: FindManyTransactionsInput): Promise<FindManyTransactionsOutputData> {
        const { data, accountId } = input
        const { options } = data
        const { take, skip } = { ...options }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        const transactions = await this.transactionMySqlRepository.find({
            relations: {
                account: true,
            },
            take, 
            skip, 
            where: {
                accountId
            },
            order: { 
                createdAt: "DESC" 
            }
        })

        const count = await this.transactionMySqlRepository.count()
        return {
            results: transactions,
            metadata: {
                count
            }
        }
    }
}
