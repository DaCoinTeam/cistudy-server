import { CourseVerifyStatus } from "@common"
import { AccountMySqlEntity, AccountReviewMySqlEntity, CourseMySqlEntity, FollowMySqlEnitity, ReportAccountMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, Repository } from "typeorm"
import { FindManyAccountReportsInput, FindManyAccountReviewsInput, FindManyAccountsInput, FindManyFollowersInput, FindManyPendingCourseInput, FindOneAccountInput } from "./accounts.input"
import { FindManyAccountReportsOutputData, FindManyAccountReviewsOutputData, FindManyAccountsOutputData, FindManyPendingCourseOutputData } from "./accounts.output"

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
        private readonly dataSource: DataSource,
    ) { }

    async findOneAccount(input: FindOneAccountInput): Promise<AccountMySqlEntity> {
        const { data } = input
        const { params, options } = data
        const { accountId } = params
        const { followerId } = options

        const account = await this.accountMySqlRepository.findOne({
            where:{
                accountId
            }
        })

        const follow = await this.followMySqlRepository.findOne({
            where:{
                followerId,
                followedAccountId: accountId,
                followed: true
            }
        })

        const numberOfFollowersResult = await this.followMySqlRepository.count({
            where:{
                followedAccountId: accountId,
                followed: true
            }
        })

        account.numberOfFollowers = numberOfFollowersResult
        const followed = follow?.followed
        account.followed = followed ?? false

        return account

    }

    async findManyFollowers(input: FindManyFollowersInput): Promise<Array<AccountMySqlEntity>> {
        const { data } = input
        const { params } = data
        const { accountId } = params

        const followRelations = await this.followMySqlRepository.find(
            {
                where: {
                    followedAccountId: accountId,
                    followed: true
                },
                relations: {
                    follower: true
                }
            }
        )
        return followRelations.map(followRelation => followRelation.follower)
    }

    async findManyAccounts(input: FindManyAccountsInput): Promise<FindManyAccountsOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = { ...options }

        const results = await this.accountMySqlRepository.find(
            {
                skip,
                take,
            })

        const count = await this.accountMySqlRepository.count()

        return {
            results,
            metadata: {
                count,
            }
        }

    }

    async findManyAccountReviews(input: FindManyAccountReviewsInput): Promise<FindManyAccountReviewsOutputData> {
        const { data } = input
        const { params, options } = data
        const { accountId } = params
        const { skip, take } = options

        const results = await this.accountReviewMySqlRepository.find({
            where: { accountId },
            relations: {
                account: true,
                reviewedAccount: true
            },
            skip,
            take,
            order: { createdAt: "DESC" }
        })

        const numberOfAccountReviewsResult = await this.accountReviewMySqlRepository.count()

        return {
            results,
            metadata: {
                count: numberOfAccountReviewsResult,
            }
        }

    }

    async findManyAccountReports(input: FindManyAccountReportsInput): Promise<FindManyAccountReportsOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = options

        const results = await this.reportAccountMySqlRepository.find({
            relations: {
                reporterAccount: true,
                reportedAccount: true,
            },
            skip,
            take
        })

        const numberOfAccountReports = await this.reportAccountMySqlRepository.count()

        const promises: Array<Promise<void>> = []
        for (const {reportedAccount} of results) {
            const promise = async () => {
                reportedAccount.numberOfReports = await this.reportAccountMySqlRepository.count({
                    where:{
                        reportedId: reportedAccount.accountId
                    }
                })
            }
            promises.push(promise())
        }
        await Promise.all(promises)
        
        return {
            results,
            metadata: {
                count: numberOfAccountReports
            }
        }
        
    }

    async findManyPendingCourse(input: FindManyPendingCourseInput): Promise<FindManyPendingCourseOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = options

        const results = await this.courseMySqlRepository.find({
            where: {
                verifyStatus: CourseVerifyStatus.Pending
            },
            skip,
            take,
            relations:{
                creator : true
            }
        })

        const numberOfPendingCourse = await this.courseMySqlRepository.count({
            where:{
                verifyStatus : CourseVerifyStatus.Pending
            }
        })

        return {
            results,
            metadata: {
                count: numberOfPendingCourse
            }
        }

    }

}