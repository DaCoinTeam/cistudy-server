import {
    InstructorStatus,
    NotificationType,
    SystemRoles,
    TransactionType,
    computeDenomination,
    computeRaw,
    existKeyNotUndefined,
} from "@common"
import {
    AccountJobMySqlEntity,
    AccountMySqlEntity,
    AccountQualificationMySqlEntity,
    NotificationMySqlEntity,
    RoleMySqlEntity,
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
    AddJobInput,
    AddQualificationInput,
    DeleteJobInput,
    DeleteNotificationInput,
    DeleteQualificationInput,
    DepositInput,
    IsSastifyCommunityStandardInput,
    MarkAllNotificationsAsReadInput,
    MarkNotificationAsReadInput,
    RegisterInstructorInput,
    UpdateJobInput,
    UpdateProfileInput,
    UpdateQualificationInput,
    WithdrawInput,
} from "./profile.input"
import {
    AddJobOutput,
    AddQualificationInputOutput,
    DeleteJobOutput,
    DeleteNotificationOutput,
    DeleteQualificationOutput,
    DepositOutput,
    IsSastifyCommunityStandardOutput,
    MarkAllNotificationsAsReadOutput,
    MarkNotificationAsReadOutput,
    RegisterInstructorOutput,
    UpdateJobOutput,
    UpdateProfileOutput,
    UpdateQualificationOutput,
    WithdrawOutput,
} from "./profile.output"
import { OpenApiService } from "src/global/services/openapi.service"

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(AccountJobMySqlEntity)
        private readonly accountJobMySqlRepository: Repository<AccountJobMySqlEntity>,
        @InjectRepository(AccountQualificationMySqlEntity)
        private readonly accountQualificationMySqlRepository: Repository<AccountQualificationMySqlEntity>,
        @InjectRepository(TransactionMySqlEntity)
        private readonly transactionMySqlRepository: Repository<TransactionMySqlEntity>,
        @InjectModel(TransactionMongoEntity.name)
        private readonly transactionMongoModel: Model<TransactionMongoEntity>,
        @InjectRepository(NotificationMySqlEntity)
        private readonly notificationMySqlRepository: Repository<NotificationMySqlEntity>,
        @InjectRepository(RoleMySqlEntity)
        private readonly roleMySqlRepository: Repository<RoleMySqlEntity>,
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

    async addJob(input: AddJobInput): Promise<AddJobOutput> {
        const { accountId, data, files } = input
        const { companyName, role, startDate, endDate, companyLogoIndex } = data

        const accountJob: DeepPartial<AccountJobMySqlEntity> = {
            accountId,
            companyName,
            role,
            startDate
        }

        const file = files.at(companyLogoIndex)
        const { assetId } = await this.storageService.upload({
            rootFile: file,
        })
        accountJob.companyThumbnailId = assetId

        if (endDate) accountJob.endDate = endDate

        await this.accountJobMySqlRepository.save(accountJob)

        return {
            message: "Account job added successfully"
        }

    }

    async updateJob(input: UpdateJobInput): Promise<UpdateJobOutput> {
        const { data, files } = input
        const { accountJobId, companyName, role, startDate, endDate, companyLogoIndex } = data

        const accountJob: DeepPartial<AccountJobMySqlEntity> = {
            companyName,
            role,
            startDate
        }

        if (files) {
            const file = files.at(companyLogoIndex)
            const { assetId } = await this.storageService.upload({
                rootFile: file,
            })
            accountJob.companyThumbnailId = assetId
        }

        if (endDate) accountJob.endDate = endDate

        await this.accountJobMySqlRepository.update(accountJobId, accountJob)

        return {
            message: "Account job updated successfully"
        }
    }

    async deleteJob(input: DeleteJobInput): Promise<DeleteJobOutput> {
        const { data } = input
        const { accountJobId } = data

        const found = await this.accountJobMySqlRepository.findOneBy({ accountJobId })

        if (!found) {
            throw new NotFoundException("Account's job not found")
        }
        const { companyThumbnailId } = found
        await this.storageService.delete(companyThumbnailId)
        await this.accountJobMySqlRepository.delete({ accountJobId })

        return { message: "Account's job deleted successfully" }
    }

    async addQualification(input: AddQualificationInput): Promise<AddQualificationInputOutput> {
        const { accountId, data, files } = input
        const { fileIndex, issuedAt, issuedFrom, name, url } = data

        const { assetId } = await this.storageService.upload({
            rootFile: files.at(fileIndex),
        })
        
        await this.accountQualificationMySqlRepository.save({
            accountId,
            issuedAt,
            issuedFrom,
            name,
            url,
            fileId: assetId,
        })

        const { roles } = await this.accountMySqlRepository.findOne({
            where: {
                accountId
            },
            relations: {
                roles: true
            }
        })

        if (!roles.some((role) => role.name === SystemRoles.Instructor)) {
            await this.roleMySqlRepository.save({
                accountId,
                name: SystemRoles.Instructor
            })
        }

        return {
            message: "Qualification(s) has been added successfully"
        }
    }

    async updateQualification(input: UpdateQualificationInput): Promise<UpdateQualificationOutput> {
        const { accountId, files, data } = input
        const { accountQualificationId, issuedAt, issuedFrom, name, url, fileIndex } = data

        const exist = await this.accountQualificationMySqlRepository.findOneBy({ accountQualificationId })

        if (!exist) {
            throw new NotFoundException("Qualification not found or has been deleted.")
        }

        const qualification: DeepPartial<AccountQualificationMySqlEntity> = {
            accountId,
            issuedAt,
            issuedFrom,
            name,
            url,
        }

        if (files) {
            await this.storageService.delete(exist.fileId)
            const { assetId } = await this.storageService.upload({
                rootFile: files.at(fileIndex),
            })
            qualification.fileId = assetId
        }

        await this.accountQualificationMySqlRepository.update(accountQualificationId, qualification)

        return {
            message: "Qualification has been updated successfully"
        }
    }

    async deleteQualification(
        input: DeleteQualificationInput,
    ): Promise<DeleteQualificationOutput> {
        const { data } = input
        const { accountQualificationId } = data

        const qualification = await this.accountQualificationMySqlRepository.findOne({
            where: {
                accountQualificationId,
            },
            relations: {
                account: {
                    roles: true,
                    accountQualifications: true
                }
            }
        })

        if (!qualification) {
            throw new NotFoundException("Account's qualification not found")
        }

        if (qualification.account.accountQualifications.length == 1) {
            throw new ConflictException("You must have at least 1 qualification, try updating this qualification instead.")
        }

        await this.storageService.delete(qualification.fileId)
        await this.accountQualificationMySqlRepository.delete({
            accountQualificationId,
        })

        return {
            message: "Account's qualification has been deleted successfully.",
        }
    }

    async registerInstructor(input: RegisterInstructorInput): Promise<RegisterInstructorOutput> {
        const { accountId } = input

        const account = await this.accountMySqlRepository.findOneBy({ accountId })

        if (!account || !account.verified) {
            throw new NotFoundException("Account not found or not have been verified")
        }

        if (account.instructorStatus === InstructorStatus.Pending) {
            throw new ConflictException("You have request is in resolving, please try again later")
        }

        await this.accountMySqlRepository.update(accountId, {
            instructorStatus: InstructorStatus.Pending,
        })

        await this.notificationMySqlRepository.save({
            receiverId: accountId,
            title: "Instructor request has been submitted",
            type: NotificationType.Instructor,
            description: "Your request to become an instructor at CiStudy has been submitted. Thanks for choosing CiStudy.",
        })

        const moderators = (
            await this.accountMySqlRepository.find({
                relations: {
                    roles: true,
                },
            })
        ).filter(({ roles }) =>
            roles.map(({ name }) => name).includes(SystemRoles.Moderator),
        )

        const notificationsToModerator: Array<
            DeepPartial<NotificationMySqlEntity>
        > = moderators.map(({ accountId }) => ({
            receiverId: accountId,
            title: "New instructor request has been submitted for verification",
            type: NotificationType.Interact,
            description: `An instructor request by user ${account.username} has been submitted, please take a look to resolve.`
        }))

        await this.notificationMySqlRepository.save(notificationsToModerator)

        return {
            message: "Your request has been submitted, thank you.",
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


    async deleteNotification(input: DeleteNotificationInput): Promise<DeleteNotificationOutput> {
        const { data } = input
        const { notificationId } = data

        await this.notificationMySqlRepository.delete({ notificationId })

        return {
            message: "Notification deleted successfully"
        }
    }

    async isSastifyCommunityStandard(input: IsSastifyCommunityStandardInput): Promise<IsSastifyCommunityStandardOutput> {
        const { message } = input
        const data = await this.openapiService.isSatisfyCommunityStandard(message)
        return {
            data
        }
    }
}
