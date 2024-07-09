import { FollowMySqlEnitity, AccountMySqlEntity, AccountReviewMySqlEntity, ReportAccountMySqlEntity, ReportCourseMySqlEntity, ReportPostMySqlEntity, ReportPostCommentMySqlEntity } from "@database"
import { Injectable, NotFoundException } from "@nestjs/common"
import { DataSource, Repository } from "typeorm"
import { FindManyFollowersInput, FindManyAccountReviewsInput, FindManyAccountsInput, FindOneAccountInput, FindManyReportsInput, FindOneReportInput } from "./accounts.input"
import { InjectRepository } from "@nestjs/typeorm"
import { FindManyAccountReviewsOutputData, FindManyAccountsOutputData, FindManyReportsOutputData } from "./accounts.output"
import { ReportModel } from "src/database/dto/report.dto"
import { ReportType } from "@common"

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

    async findManyReports(input: FindManyReportsInput): Promise<FindManyReportsOutputData> {
        const  {data} = input
        const {params, options} = data
        const {filterReports} = params
        const {skip,take} = options
        const reports: ReportModel[] = []
    
        const reportTypes = [
            { type: ReportType.Account, repository: this.reportAccountMySqlRepository, additionalRelation: "reportedAccount", Id: "reportAccountId" },
            { type: ReportType.Course, repository: this.reportCourseMySqlRepository, additionalRelation: "reportedCourse", Id: "reportCourseId" },
            { type: ReportType.Post, repository: this.reportPostMySqlRepository, additionalRelation: "reportedPost", Id: "reportPostId" },
            { type: ReportType.PostComment, repository: this.reportPostCommentMySqlRepository, additionalRelation: "reportedPostComment", Id: "reportPostCommentId" }
        ]
    
        const fetchReports = async ({ type, repository, additionalRelation, Id }) => {
            if (!filterReports || filterReports.includes(type)) {
                const fetchedReports = await repository.find({
                    relations: {
                        reporterAccount: true,
                        [additionalRelation]: true
                    }
                })
    
                reports.push(...fetchedReports.map(report => ({
                    reportId: report[Id],
                    type,
                    reporterAccount: report.reporterAccount,
                    reportedAccount: type === ReportType.Account ? report[additionalRelation] : null,
                    reportedCourse: type === ReportType.Course ? report[additionalRelation] : null,
                    reportedPost: type === ReportType.Post ? report[additionalRelation] : null,
                    reportedPostComment: type === ReportType.PostComment ? report[additionalRelation] : null,
                    description: report.description,
                    processStatus: report.processStatus,
                    processNote: report.processNote,
                    createdAt: report.createdAt,
                    updatedAt: report.updatedAt
                })))
            }
        }
    
        await Promise.all(reportTypes.map(fetchReports))
    
        const slicedReports = (skip && take) ? reports.slice(skip, skip + take) : reports
        slicedReports?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

        return {
            results: slicedReports,
            metadata: {
                count: slicedReports.length
            }
        }
    }

    async findOneReport(input: FindOneReportInput): Promise<ReportModel> {
        const { data } = input
        const { reportId, reportType } = data

        const report: ReportModel = null

        switch (reportType) {
        case ReportType.Account: {
            const accountReport = await this.reportAccountMySqlRepository.findOneBy({ reportAccountId: reportId })

            if (!accountReport) {
                throw new NotFoundException("Report not found")
            }
            const {
                reportAccountId,
                reporterAccount,
                reportedAccount,
                description,
                processStatus,
                processNote,
                createdAt,
                updatedAt
            } = accountReport

            report.reportId = reportAccountId
            report.reporterAccount = reporterAccount
            report.reportedAccount = reportedAccount
            report.description = description
            report.processStatus = processStatus
            report.processNote = processNote
            report.createdAt = createdAt
            report.updatedAt = updatedAt

            break
        }

        case ReportType.Course: {
            const courseReport = await this.reportCourseMySqlRepository.findOneBy({ reportCourseId: reportId })

            if (!courseReport) {
                throw new NotFoundException("Report not found")
            }
            const {
                reportCourseId,
                reporterAccount,
                reportedCourse,
                description,
                processStatus,
                processNote,
                createdAt,
                updatedAt
            } = courseReport

            report.reportId = reportCourseId
            report.reporterAccount = reporterAccount
            report.reportedCourse = reportedCourse
            report.description = description
            report.processStatus = processStatus
            report.processNote = processNote
            report.createdAt = createdAt
            report.updatedAt = updatedAt

            break
        }
        case ReportType.Post: {
            const postReport = await this.reportPostMySqlRepository.findOneBy({ reportPostId: reportId })

            if (!postReport) {
                throw new NotFoundException("Report not found")
            }
            const {
                reportPostId,
                reporterAccount,
                reportedPost,
                description,
                processStatus,
                processNote,
                createdAt,
                updatedAt
            } = postReport

            report.reportId = reportPostId
            report.reporterAccount = reporterAccount
            report.reportedPost = reportedPost
            report.description = description
            report.processStatus = processStatus
            report.processNote = processNote
            report.createdAt = createdAt
            report.updatedAt = updatedAt

            break
        }
        case ReportType.PostComment: {
            const postCommentReport = await this.reportPostCommentMySqlRepository.findOneBy({ reportPostCommentId: reportId })

            if (!postCommentReport) {
                throw new NotFoundException("Report not found")
            }
            const {
                reportPostCommentId,
                reporterAccount,
                reportedPostComment,
                description,
                processStatus,
                processNote,
                createdAt,
                updatedAt
            } = postCommentReport

            report.reportId = reportPostCommentId
            report.reporterAccount = reporterAccount
            report.reportedPostComment = reportedPostComment
            report.description = description
            report.processStatus = processStatus
            report.processNote = processNote
            report.createdAt = createdAt
            report.updatedAt = updatedAt

            break
        }
        default: 
            break
        }

        return report
    }
}