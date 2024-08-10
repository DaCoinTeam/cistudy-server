import {
    NotificationType,
    TransactionType,
    computeDenomination,
    computeRaw,
    existKeyNotUndefined,
} from "@common"
import {
    AccountMySqlEntity,
    NotificationMySqlEntity,
    TransactionMongoEntity,
    TransactionMySqlEntity,
} from "@database"
import { BlockchainService, StorageService } from "@global"
import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { InjectRepository } from "@nestjs/typeorm"
import { Model } from "mongoose"
import { DeepPartial, In, Repository } from "typeorm"
import Web3 from "web3"
import {
    DeleteNotificationInput,
    DepositInput,
    IsSastifyCommunityStandardInput,
    MarkAllNotificationsAsReadInput,
    MarkNotificationAsReadInput,
    UpdateProfileInput,
    WithdrawInput,
} from "./profile.input"
import {
    DeleteNotificationOutput,
    DepositOutput,
    IsSastifyCommunityStandardOutput,
    MarkAllNotificationsAsReadOutput,
    MarkNotificationAsReadOutput,
    UpdateProfileOutput,
    WithdrawOutput,
} from "./profile.output"
import { OpenApiService } from "src/global/services/openapi.service"

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(TransactionMySqlEntity)
        private readonly transactionMySqlRepository: Repository<TransactionMySqlEntity>,
        @InjectModel(TransactionMongoEntity.name)
        private readonly transactionMongoModel: Model<TransactionMongoEntity>,
        @InjectRepository(NotificationMySqlEntity)
        private readonly notificationMySqlRepository: Repository<NotificationMySqlEntity>,
        private readonly storageService: StorageService,
        private readonly blockchainService: BlockchainService,
        private readonly openapiService: OpenApiService,
    ) { }

    async updateProfile(input: UpdateProfileInput): Promise<UpdateProfileOutput> {
        const { accountId, data, files } = input
        const { username, birthdate, avatarIndex, coverPhotoIndex, walletAddress } =
            data
        //validate to ensure it is image

        const { avatarId, coverPhotoId } =
            await this.accountMySqlRepository.findOneBy({ accountId })

        const profile: DeepPartial<AccountMySqlEntity> = {
            username,
            birthdate,
            walletAddress,
        }

        if (Number.isInteger(avatarIndex)) {
            const file = files.at(avatarIndex)
            if (avatarId) {
                await this.storageService.update(avatarId, {
                    rootFile: file,
                })
            } else {
                const { assetId } = await this.storageService.upload({
                    rootFile: file,
                })
                profile.avatarId = assetId
            }
        }
        if (Number.isInteger(coverPhotoIndex)) {
            const file = files.at(coverPhotoIndex)
            if (coverPhotoId) {
                await this.storageService.update(coverPhotoId, {
                    rootFile: file,
                })
            } else {
                const { assetId } = await this.storageService.upload({
                    rootFile: file,
                })
                profile.coverPhotoId = assetId
            }
        }

        if (existKeyNotUndefined(profile))
            await this.accountMySqlRepository.update(accountId, profile)

        return {
            message: "Profile Updated Successfully",
        }
    }

    async withdraw(input: WithdrawInput): Promise<WithdrawOutput> {
        const { accountId, data } = input
        const { withdrawAmount } = data
        //validate to ensure it is image

        const { balance } = await this.accountMySqlRepository.findOneBy({
            accountId,
        })

        if (balance < withdrawAmount)
            throw new ConflictException("Withdraw amount exceeds balance.")

        const updatedBalance = balance - withdrawAmount
        const profile: DeepPartial<AccountMySqlEntity> = { balance: updatedBalance }

        const { walletAddress } = await this.accountMySqlRepository.findOne({
            where: {
                accountId,
            },
        })

        if (existKeyNotUndefined(profile))
            await this.accountMySqlRepository.update(accountId, profile)

        const { transactionHash } = await this.blockchainService.transfer(
            walletAddress,
            computeRaw(withdrawAmount),
        )

        await this.transactionMySqlRepository.save({
            accountId,
            amountDepositedChange: -withdrawAmount,
            amountOnChainChange: +withdrawAmount,
            transactionHash: Web3.utils.bytesToHex(transactionHash),
            type: TransactionType.Withdraw,
        })

        return { message: "Withdraw successfully." }
    }

    async deposit(input: DepositInput): Promise<DepositOutput> {
        const { accountId, data } = input
        const { transactionHash } = data
        let { maxQueries, queryIntervalMs } = data

        if (!maxQueries) maxQueries = 10
        if (!queryIntervalMs) queryIntervalMs = 500

        let isValidated: boolean = false
        let value: string = ""
        let hasFound: boolean = false

        for (let curentQuerry = 0; curentQuerry < maxQueries; curentQuerry++) {
            try {
                const transaction = await this.transactionMongoModel.findOne({
                    transactionHash,
                })

                if (transaction) {
                    isValidated = transaction.isValidated
                    value = transaction.value
                    break
                }

                if (curentQuerry === maxQueries - 1) {
                    hasFound = true
                }
            } catch (ex) {
                //continue
            }
        }

        if (hasFound) throw new NotFoundException("Transaction not found.")
        if (isValidated)
            throw new ConflictException("Transaction has been validated")

        const { balance } = await this.accountMySqlRepository.findOne({
            where: {
                accountId,
            },
        })

        const amount = computeDenomination(BigInt(value))

        await this.accountMySqlRepository.update(accountId, {
            balance: balance + amount,
        })

        await this.transactionMongoModel.updateOne(
            {
                transactionHash,
            },
            {
                $set: {
                    isValidated: true,
                },
            },
        )

        await this.transactionMySqlRepository.save({
            accountId,
            amountDepositedChange: amount,
            amountOnChainChange: -amount,
            transactionHash,
            type: TransactionType.Deposit,
        })

        await this.notificationMySqlRepository.save({
            receiverId: accountId,
            title: "You have new update on your balance!",
            type: NotificationType.Transaction,
            description: `You have received ${amount} STARCI(s)`,
        })

        return {
            message: "Deposit successfully.",
            others: {
                amount,
            },
        }
    }

    async markNotificationAsRead(input: MarkNotificationAsReadInput): Promise<MarkNotificationAsReadOutput> {
        const { data } = input
        const { notificationIds } = data

        await this.notificationMySqlRepository.update({
            notificationId: In(notificationIds)
        }, { viewed: true })

        return {
            message: "Marked successfully"
        }
    }

    async markAllNotificationsAsRead(input: MarkAllNotificationsAsReadInput): Promise<MarkAllNotificationsAsReadOutput> {
        const { accountId } = input

        const notifications = await this.notificationMySqlRepository.find({
            where: {
                receiverId: accountId
            }
        })

        await this.notificationMySqlRepository.save(notifications.map(notification => {
            notification.viewed = true 
            return notification
        }))

        return {
            message: "Marked all notifications successfully"
        }
    }


    async deleteNotification(input : DeleteNotificationInput) : Promise<DeleteNotificationOutput> {
        const { data } = input
        const {notificationId } = data

        await this.notificationMySqlRepository.delete({ notificationId })

        return {
            message: "Notification deleted successfully"
        }
    }

    async isSastifyCommunityStandard(input : IsSastifyCommunityStandardInput) : Promise<IsSastifyCommunityStandardOutput> {
        const { message } = input
        const data = await this.openapiService.isSatisfyCommunityStandard(message)
        return {
            data
        }
    }
}
