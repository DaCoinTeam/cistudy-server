import { CourseMySqlEntity, FollowMySqlEnitity, AccountMySqlEntity, AccountReviewMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { DataSource, Repository } from "typeorm"
import { FindManyCreatedCoursesInput, FindManyFollowersInput, FindManyAccountReviewsInput, FindManyAccountsInput, FindOneAccountInput } from "./accounts.input"
import { InjectRepository } from "@nestjs/typeorm"
import { FindManyAccountReviewsOutputData, FindManyAccountsOutputData } from "./accounts.output"
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
        const { data } = input;
        const { params, options } = data;
        const { accountId } = params;
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
                order: { createdAt: 'DESC' }
            });
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
}