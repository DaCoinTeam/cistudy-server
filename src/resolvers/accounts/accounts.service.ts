import { CourseMySqlEntity, FollowMySqlEnitity, AccountMySqlEntity, AccountReviewMySqlEntity, ReportAccountMySqlEntity, ReportCourseMySqlEntity, ReportPostMySqlEntity, ReportPostCommentMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { DataSource, Repository } from "typeorm"
import { FindManyFollowersInput, FindManyAccountReviewsInput, FindManyAccountsInput, FindOneAccountInput, FindManyReportsInput } from "./accounts.input"
import { InjectRepository } from "@nestjs/typeorm"
import { FindManyAccountReviewsOutputData, FindManyAccountsOutputData, FindManyReportOutput, FindManyReportOutputData } from "./accounts.output"
import { ReportModel } from "src/database/abstract/report.abstract"
import { ReportType } from "@common"



@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(FollowMySqlEnitity)
        private readonly followMySqlRepository: Repository<FollowMySqlEnitity>,
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        @InjectRepository(AccountReviewMySqlEntity)
        private readonly accountReviewMySqlRepository: Repository<AccountReviewMySqlEntity>,
        @InjectRepository(ReportAccountMySqlEntity)
        private readonly reportAccountMySqlRepository: Repository<ReportAccountMySqlEntity>,
        @InjectRepository(ReportCourseMySqlEntity)
        private readonly reportCourseMySqlRepository: Repository<ReportCourseMySqlEntity>,
        @InjectRepository(ReportPostMySqlEntity)
        private readonly reportPostMySqlRepository: Repository<ReportPostMySqlEntity>,
        @InjectRepository(ReportPostCommentMySqlEntity)
        private readonly reportPostCommentMySqlRepository: Repository<ReportPostCommentMySqlEntity>,
        private readonly dataSource: DataSource,
    ) { }

    async findOneAccount(input: FindOneAccountInput): Promise<AccountMySqlEntity> {
        const { data } = input
        const { params, options } = data
        const { accountId } = params
        const { followerId } = options

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const account = await queryRunner.manager.findOne(AccountMySqlEntity, {
                where: { accountId },
                relations: {
                    //cart: true
                }
            })

            const follow = await queryRunner.manager.findOne(
                FollowMySqlEnitity,
                {
                    where: {
                        followerId,
                        followedAccountId: accountId,
                        followed: true
                    }
                }
            )

            const numberOfFollowersResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(FollowMySqlEnitity, "follow")
                .where("followedAccountId = :accountId", { accountId })
                .andWhere("followed = :followed", { followed: true })
                .getRawOne()

            await queryRunner.commitTransaction()

            account.numberOfFollowers = numberOfFollowersResult.count
            const followed = follow?.followed
            account.followed = followed ?? false

            return account
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
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

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const results = await this.accountMySqlRepository.find(
                {
                    skip,
                    take,
                })

            const count = await this.accountMySqlRepository.count()

            await queryRunner.commitTransaction()

            return {
                results,
                metadata: {
                    count,
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findManyAccountReviews(input: FindManyAccountReviewsInput): Promise<FindManyAccountReviewsOutputData> {
        const { data } = input
        const { params, options } = data
        const { accountId } = params
        const { skip, take } = options

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
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
            const numberOfAccountReviewsResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(AccountReviewMySqlEntity, "account-review")
                .where("accountId = :accountId ", { accountId })
                .getRawOne()

            return {
                results,
                metadata: {
                    count: numberOfAccountReviewsResult.count,
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    async findManyReports(input: FindManyReportsInput): Promise<FindManyReportOutputData> {
        const { accountId, data } = input
        const { params, options } = data
        const { filterReports } = params
        const { skip, take } = options

        let reports: ReportModel[] = []

        if (!filterReports || filterReports.includes(ReportType.Account)) {
            const accountReports = await this.reportAccountMySqlRepository.find({});
            reports = reports.concat(accountReports.map(report => ({
                reportId: report.reportAccountId,
                type: ReportType.Account,
                reporterAccountId: report.reporterAccountId,
                reportContentId: report.reportedAccountId,
                description: report.description,
                processStatus: report.processStatus,
                processNote: report.processNote,
                createdAt: report.createdAt,
                updatedAt: report.updatedAt
            })));
        }

        if (!filterReports || filterReports.includes(ReportType.Course)) {
            const courseReports = await this.reportCourseMySqlRepository.find({});
            reports = reports.concat(courseReports.map(report => ({
                reportId: report.reportCourseId,
                type: ReportType.Course,
                reporterAccountId: report.reporterAccountId,
                reportContentId: report.reportedCourseId,
                description: report.description,
                processStatus: report.processStatus,
                processNote: report.processNote,
                createdAt: report.createdAt,
                updatedAt: report.updatedAt
            })));
        }

        if (!filterReports || filterReports.includes(ReportType.Post)) {
            const postReports = await this.reportPostMySqlRepository.find({});
            reports = reports.concat(postReports.map(report => ({
                reportId: report.reportPostId,
                type: ReportType.Post,
                reporterAccountId: report.reporterAccountId,
                reportContentId: report.reportedPostId,
                description: report.description,
                processStatus: report.processStatus,
                processNote: report.processNote,
                createdAt: report.createdAt,
                updatedAt: report.updatedAt
            })));
        }

        if (!filterReports || filterReports.includes(ReportType.PostComment)) {
            const postCommentReports = await this.reportPostCommentMySqlRepository.find({});
            reports = reports.concat(postCommentReports.map(report => ({
                reportId: report.reportPostCommentId,
                type: ReportType.PostComment,
                reporterAccountId: report.reporterAccountId,
                reportContentId: report.reportedPostCommentId,
                description: report.description,
                processStatus: report.processStatus,
                processNote: report.processNote,
                createdAt: report.createdAt,
                updatedAt: report.updatedAt
            })));
        }

        return {
            results: reports.splice(skip, take),
            metadata: {
                count: reports.length
            }
        }
    }

}