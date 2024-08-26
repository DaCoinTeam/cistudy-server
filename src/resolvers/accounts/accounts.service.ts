import { CourseVerifyStatus, InstructorStatus, ReportProcessStatus } from "@common"
import {
    AccountMySqlEntity,
    AccountReviewMySqlEntity,
    ConfigurationMySqlEntity,
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    FollowMySqlEnitity,
    NotificationMySqlEntity,
    OrderMySqlEntity,
    ReportAccountMySqlEntity,
    TransactionMySqlEntity,
} from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, In, Not, Repository } from "typeorm"
import {
    FindManyAccountReportsInput,
    FindManyAccountReviewsInput,
    FindManyAccountsInput,
    FindManyAdminTransactionsInput,
    FindManyFollowersInput,
    FindManyNotificationsInput,
    FindManyPendingInstructorInput,
    FindManyPublishedCoursesInput,
    FindOneAccountInput,
    FindOneAdminAccountInput
} from "./accounts.input"
import {
    FindManyAccountReportsOutputData,
    FindManyAccountReviewsOutputData,
    FindManyAccountsOutputData,
    FindManyAdminTransactionsOutputData,
    FindManyNotificationsOutputData,
    FindManyPendingInstructorOutputData,
    FindManyPublishedCoursesOutputData,
    GetAdminAnalyticsOutputData,
} from "./accounts.output"

@Injectable()
export class AccountsService {
    constructor(
    @InjectRepository(AccountMySqlEntity)
    private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
    @InjectRepository(FollowMySqlEnitity)
    private readonly followMySqlRepository: Repository<FollowMySqlEnitity>,
    @InjectRepository(AccountReviewMySqlEntity)
    private readonly accountReviewMySqlRepository: Repository<AccountReviewMySqlEntity>,
    @InjectRepository(ReportAccountMySqlEntity)
    private readonly reportAccountMySqlRepository: Repository<ReportAccountMySqlEntity>,
    @InjectRepository(CourseMySqlEntity)
    private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
    @InjectRepository(NotificationMySqlEntity)
    private readonly notificationMySqlRepository: Repository<NotificationMySqlEntity>,
    @InjectRepository(TransactionMySqlEntity)
    private readonly transactionMySqlRepository: Repository<TransactionMySqlEntity>,
    @InjectRepository(EnrolledInfoMySqlEntity)
    private readonly enrolledInfoMySqlRepository: Repository<EnrolledInfoMySqlEntity>,
    @InjectRepository(ConfigurationMySqlEntity)
    private readonly configurationMySqlRepository: Repository<ConfigurationMySqlEntity>,
    @InjectRepository(OrderMySqlEntity)
    private readonly orderMySqlRepository: Repository<OrderMySqlEntity>,
    private readonly dataSource: DataSource,
    ) {}

    async findOneAccount(
        input: FindOneAccountInput,
    ): Promise<AccountMySqlEntity> {
        const { data } = input
        const { params, options } = data
        const { accountId } = params
        const { followerId } = options

        const account = await this.accountMySqlRepository.findOne({
            where: {
                accountId,
            },
            relations:{
                accountJobs: true,
                accountQualifications: true
            }
        })

        const follow = await this.followMySqlRepository.findOne({
            where: {
                followerId,
                followedAccountId: accountId,
                followed: true,
            },
        })

        const numberOfFollowersResult = await this.followMySqlRepository.count({
            where: {
                followedAccountId: accountId,
                followed: true,
            },
        })

        account.numberOfFollowers = numberOfFollowersResult
        const followed = follow?.followed
        account.followed = followed ?? false

        return account
    }

    async findManyFollowers(
        input: FindManyFollowersInput,
    ): Promise<Array<AccountMySqlEntity>> {
        const { data } = input
        const { params } = data
        const { accountId } = params

        const followRelations = await this.followMySqlRepository.find({
            where: {
                followedAccountId: accountId,
                followed: true,
            },
            relations: {
                follower: true,
            },
        })
        return followRelations.map((followRelation) => followRelation.follower)
    }

    async findManyAccounts(
        input: FindManyAccountsInput,
    ): Promise<FindManyAccountsOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = { ...options }

        const results = await this.accountMySqlRepository.find({
            skip,
            take,
            order: {
                createdAt: "DESC"
            }
        })

        const count = await this.accountMySqlRepository.count()

        return {
            results,
            metadata: {
                count,
            },
        }
    }

    async findManyAccountReviews(
        input: FindManyAccountReviewsInput,
    ): Promise<FindManyAccountReviewsOutputData> {
        const { data } = input
        const { params, options } = data
        const { accountId } = params
        const { skip, take } = options

        const results = await this.accountReviewMySqlRepository.find({
            where: { accountId },
            relations: {
                account: true,
                reviewedAccount: true,
            },
            skip,
            take,
            order: { createdAt: "DESC" },
        })

        const numberOfAccountReviewsResult =
      await this.accountReviewMySqlRepository.count()

        return {
            results,
            metadata: {
                count: numberOfAccountReviewsResult,
            },
        }
    }

    async findManyAccountReports(
        input: FindManyAccountReportsInput,
    ): Promise<FindManyAccountReportsOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = options

        const pendingReports = await this.reportAccountMySqlRepository.find({
            where:{
                processStatus: ReportProcessStatus.Processing
            },
            relations: {
                reporterAccount: true,
                reportedAccount: true,
            },
        })

        const exceptPendingReports = await this.reportAccountMySqlRepository.find({
            where:{
                processStatus: Not(ReportProcessStatus.Processing)
            },
            relations: {
                reporterAccount: true,
                reportedAccount: true,
            },
        })

        const results = [...pendingReports, ...exceptPendingReports]

        if(skip !== null && take !== null){
            results.slice(skip, skip + take)
        }

        const numberOfAccountReports =
      await this.reportAccountMySqlRepository.count()

        const promises: Array<Promise<void>> = []
        for (const { reportedAccount } of results) {
            const promise = async () => {
                reportedAccount.numberOfReports =
          await this.reportAccountMySqlRepository.count({
              where: {
                  reportedId: reportedAccount.accountId,
              },
          })
            }
            promises.push(promise())
        }
        await Promise.all(promises)

        return {
            results,
            metadata: {
                count: numberOfAccountReports,
            },
        }
    }

    async findManyPublishedCourses(
        input: FindManyPublishedCoursesInput,
    ): Promise<FindManyPublishedCoursesOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = options

        const pendingCourses = await this.courseMySqlRepository.find({
            where: {
                verifyStatus: CourseVerifyStatus.Pending,
                isDeleted: false
            },
            relations: {
                creator: true,
            },
            order:{
                createdAt: "DESC"
            }
        })

        const exceptPendingCourses = await this.courseMySqlRepository.find({
            where: {
                verifyStatus: Not(In([CourseVerifyStatus.Pending, CourseVerifyStatus.Draft])),
                isDeleted: false
            },
            relations: {
                creator: true,
            },
            order: {
                createdAt: "DESC",
            },
        })
        
        const results = [...pendingCourses, ...exceptPendingCourses]

        if (skip !== null && take !== null){
            results.slice(skip, skip + take)
        } 

        const numberOfPublishedCourses = await this.courseMySqlRepository.count({
            where:{
                verifyStatus: Not(CourseVerifyStatus.Draft),
                isDeleted: false
            }
        })
        
        return {
            results,
            metadata: {
                count: numberOfPublishedCourses,
            },
        }
    }

    async findManyPendingInstructor(
        input: FindManyPendingInstructorInput,
    ): Promise<FindManyPendingInstructorOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = options

        const results = await this.accountMySqlRepository.find({
            where: {
                instructorStatus: InstructorStatus.Pending,
            },
            skip,
            take,
        })

        const numberOfPendingInstructor = await this.accountMySqlRepository.count({
            where: {
                instructorStatus: InstructorStatus.Pending,
            },
        })

        return {
            results,
            metadata: {
                count: numberOfPendingInstructor,
            },
        }
    }

    async findManyAdminTransactions(
        input: FindManyAdminTransactionsInput,
    ): Promise<FindManyAdminTransactionsOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = { ...options }

        const results = await this.transactionMySqlRepository.find({
            skip,
            take,
            relations: {
                account: true,
                transactionDetails: {
                    account: true,
                    course: true,
                    post: true,
                    postComment: {
                        post: true,
                    },
                    
                },
            },
            order: {
                createdAt: "DESC",
            },
        })

        const count = await this.transactionMySqlRepository.count()

        return {
            results,
            metadata: {
                count,
            },
        }
    }

    async findManyNotifications(
        input: FindManyNotificationsInput,
    ): Promise<FindManyNotificationsOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = { ...options }

        const results = await this.notificationMySqlRepository.find({
            skip,
            take,
            relations: {
                sender: true,
                receiver: true,
            },
            order: {
                createdAt: "DESC",
            },
        })

        const count = await this.notificationMySqlRepository.count()

        return {
            results,
            metadata: {
                count,
            },
        }
    }

    async getAdminAnalytics(): Promise<GetAdminAnalyticsOutputData> {
        const numberOfAccounts = await this.accountMySqlRepository.count()
        const numberOfCourses = await this.courseMySqlRepository.count({
            where: {
                isDeleted: false,
            },
        })
        const numberOfTransactions = await this.transactionMySqlRepository.count()
        const numberOfOrders = await this.orderMySqlRepository.count()

        const enrolledInfos = await this.enrolledInfoMySqlRepository.find()

        return {
            numberOfAccounts,
            numberOfCourses,
            numberOfTransactions,
            numberOfOrders,
            enrolledInfos
        }
    }

    async findLatestConfiguration(): Promise<ConfigurationMySqlEntity> {
        const configurations = await this.configurationMySqlRepository.find({
            order: {
                createdAt: "DESC"
            }
        })
        return configurations.at(0)
    }

    async findOneAdminAccount(
        input: FindOneAdminAccountInput,
    ): Promise<AccountMySqlEntity> {
        const { data } = input
        const { params } = data
        const { accountId } = params

        const account = await this.accountMySqlRepository.findOne({
            where: {
                accountId,
            },
            relations: {
                roles: true
            }
        })

        return account
    }
}
