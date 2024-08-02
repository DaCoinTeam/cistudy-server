
import { AccountMySqlEntity, CertificateMySqlEntity, CourseMySqlEntity, CourseRating, CourseReviewMySqlEntity, EnrolledInfoMySqlEntity, FollowMySqlEnitity, NotificationMySqlEntity, PostMySqlEntity, TransactionMySqlEntity } from "@database"
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

        const numberOfFollowersResults = 
                await this.courseMySqlRepository.createQueryBuilder()
                    .select("COUNT(follow.followerId)", "count")
                    .addSelect("course.courseId", "courseId")
                    .innerJoin(AccountMySqlEntity, "account", "course.creatorId = account.accountId")
                    .innerJoin(FollowMySqlEnitity, "follow", "account.accountId = follow.followerId")
                    .where("followed = :followed", { followed: true })
                    .groupBy("course.courseId")
                    .getRawMany()

        const numberOfEnrolledCoursesResult = await this.courseMySqlRepository.createQueryBuilder()
            .select("COUNT(*)", "count")
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
                const numberOfFollowers = numberOfFollowersResults.find(
                    result => result.courseId === course.courseId,
                )?.count ?? 0
                course.creator.numberOfFollowers = numberOfFollowers
                course.numberOfRewardedPostsLeft = numberOfRewardedPostsLeft

                return course
            }),
            metadata: {
                count: numberOfEnrolledCoursesResult.count
            }
        }
    }

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
                isPublished: true
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

        return {
            results,
            metadata: {
                count: numberOfNotifications
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
