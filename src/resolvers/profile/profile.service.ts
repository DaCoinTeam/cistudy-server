
import { CertificateMySqlEntity, CourseMySqlEntity, CourseRating, CourseReviewMySqlEntity, EnrolledInfoMySqlEntity, FollowMySqlEnitity, NotificationMySqlEntity, PostMySqlEntity, TransactionMySqlEntity } from "@database"
import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, Repository } from "typeorm"
import {
    FindManyEnrolledCoursesInput,
    FindManyReceivedNotificationsInput,
    FindManySelfCreatedCoursesInput, FindManyTransactionsInput,
    FindOneCertificateInput
} from "./profile.input"
import { FindManyEnrolledCoursesOutputData, FindManyReceivedNotificationsOutputData, FindManySelfCreatedCoursesOutputData, FindManyTransactionsOutputData } from "./profile.output"

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        @InjectRepository(CertificateMySqlEntity)
        private readonly certificateMySqlRepository: Repository<CertificateMySqlEntity>,
        @InjectRepository(PostMySqlEntity)
        private readonly postMySqlRepository: Repository<PostMySqlEntity>,
        @InjectRepository(TransactionMySqlEntity)
        private readonly transactionMySqlRepository: Repository<TransactionMySqlEntity>,
        @InjectRepository(NotificationMySqlEntity)
        private readonly notificationMySqlRepository: Repository<NotificationMySqlEntity>,
        @InjectRepository(FollowMySqlEnitity)
        private readonly followMySqlRepository: Repository<FollowMySqlEnitity>,
        @InjectRepository(CourseReviewMySqlEntity)
        private readonly courseReviewMySqlRepository: Repository<CourseReviewMySqlEntity>,
        @InjectRepository(EnrolledInfoMySqlEntity)
        private readonly enrolledInfoMySqlRepository: Repository<EnrolledInfoMySqlEntity>,
        private readonly dataSource: DataSource,
    ) { }

    async findManySelfCreatedCourses(
        input: FindManySelfCreatedCoursesInput,
    ): Promise<FindManySelfCreatedCoursesOutputData> {
        const { data, accountId } = input
        const { options } = data
        const { take, skip } = { ...options }

        const courses = await this.courseMySqlRepository.find({
            where: {
                creatorId: accountId,
            },
            take,
            skip,
            order: {
                updatedAt: "DESC"
            }
        })

        const numberOfCoursesResult = await this.courseMySqlRepository.count({
            where: {
                creatorId: accountId
            }
        })

        return {
            results: courses,
            metadata: {
                count: numberOfCoursesResult
            }
        }
    }

    async findManyEnrolledCourses(input: FindManyEnrolledCoursesInput): Promise<FindManyEnrolledCoursesOutputData> {
        const { data, accountId } = input
        const { options } = data
        const { take, skip } = { ...options }
    
        const courses = await this.courseMySqlRepository.find({
            relations: {
                creator: true,
                enrolledInfos: true,
                sections: {
                    contents: {
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
    
        const creatorIds = courses.map(course => course.creator.accountId)
    
        const numberOfFollowersResults = await this.followMySqlRepository
            .createQueryBuilder("follow")
            .select("follow.followedAccountId, COUNT(follow.followedAccountId) as count")
            .where("follow.followedAccountId IN (:...creatorIds)", { creatorIds })
            .groupBy("follow.followedAccountId")
            .getRawMany()
    
        const followerCountMap = numberOfFollowersResults.reduce((map, item) => {
            map[item.followedAccountId] = parseInt(item.count, 10)
            return map
        }, {})
    

        const numberOfEnrolledCoursesResult = await this.courseMySqlRepository.createQueryBuilder()
            .select("COUNT(*)", "count")
            .innerJoin(CourseMySqlEntity, "course")
            .innerJoin(EnrolledInfoMySqlEntity, "enrolledInfo", "course.courseId = enrolledInfo.courseId")
            .where("enrolledInfo.accountId = :accountId", { accountId })
            .andWhere("enrolledInfo.enrolled = :enrolled", { enrolled: true })
            .getRawOne()
    

        const numberOfRewardedPosts = await this.postMySqlRepository.find({
            where: {
                creatorId: accountId
            },
            order: {
                createdAt: "ASC"
            }
        })
    
        const numberOfRewardedPostsLeft = 3 - Math.min(numberOfRewardedPosts.length, 3)
    
        return {
            results: courses.map(course => {
                course.creator.numberOfFollowers = followerCountMap[course.creator.accountId] || 0
                course.numberOfRewardedPostsLeft = numberOfRewardedPostsLeft
    
                return course
            }),
            metadata: {
                count: numberOfEnrolledCoursesResult.count
            }
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

    async findManyReceivedNotifications(input: FindManyReceivedNotificationsInput): Promise<FindManyReceivedNotificationsOutputData> {
        const { data, accountId } = input
        const { options } = data
        const { take, skip } = options

        const results = await this.notificationMySqlRepository.find({
            where: {
                receiverId: accountId,
                //isPublished: true
            },
            skip,
            take,
            relations: {
                sender: true,
                receiver: true,
                course: true
            },
            order:{
                createdAt: "DESC"
            }
        })

        const numberOfNotifications = await this.notificationMySqlRepository.count({
            where: {
                receiverId: accountId
            }
        })

        const notViewedCount = await this.notificationMySqlRepository.count({
            where: {
                receiverId: accountId,
                viewed: false
            }
        })

        return {
            results,
            metadata: {
                count: numberOfNotifications,
                notViewedCount
            }
        }
    }

    async findOneCertificate(input: FindOneCertificateInput): Promise<CertificateMySqlEntity> {
        const { data, accountId } = input
        const { certificateId } = data

        const certificate = await this.certificateMySqlRepository.findOne({
            where: {
                certificateId,
            },
            relations: {
                account: true,
                course: {
                    creator : true,
                    courseTargets: true
                }
            }
        })

        if(!certificate){ 
            throw new NotFoundException("Certificate not found")
        }

        const numberOfCourseCreatorFollowers = await this.followMySqlRepository.count({
            where:{
                followedAccountId: certificate.course.courseId,
                followed: true
            }
        })

        const numberOfAccountFollowers = await this.followMySqlRepository.count({
            where:{
                followedAccountId: accountId,
                followed: true
            }
        })

        certificate.course.creator.numberOfFollowers = numberOfCourseCreatorFollowers
        certificate.account.numberOfFollowers = numberOfAccountFollowers

        const courseReviews = await this.courseReviewMySqlRepository.findBy({
            courseId: certificate.courseId,
        })

        const courseEnrollments = await this.enrolledInfoMySqlRepository.count({
            where: {
                courseId: certificate.courseId
            }
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

        certificate.course.courseRatings = courseRatings
        certificate.course.numberOfEnrollments = courseEnrollments

        return certificate
    }
}
