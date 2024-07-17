import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DeepPartial } from "typeorm"
import { BlockchainService, StorageService } from "@global"
import {
    DepositInput,
    UpdateProfileInput,
    WithdrawInput,
} from "./profile.input"
import { AccountMySqlEntity, TransactionMongoEntity } from "@database"
import {
    computeDenomination,
    computeRaw,
    existKeyNotUndefined,
    sleep,
} from "@common"
import {
    DepositOutput,
    UpdateProfileOutput,
    WithdrawOutput,
} from "./profile.output"
import { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class ProfileService {
    constructor(
    @InjectRepository(AccountMySqlEntity)
    private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
    @InjectModel(TransactionMongoEntity.name)
    private readonly transactionMongoModel: Model<TransactionMongoEntity>,
    private readonly storageService: StorageService,
    private readonly blockchainService: BlockchainService,
    ) {}

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
            message: `A profile with id ${accountId} has updated successfully.`,
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

        await this.blockchainService.transfer(
            walletAddress,
            computeRaw(withdrawAmount),
        )
        return { message: `Account ${accountId} has withdrawn successfully.` }
    }

    async deposit(input: DepositInput): Promise<DepositOutput> {
        const { accountId, data } = input
        const { transactionHash, maxQueries, queryIntervalMs } = data
        //validate to ensure it is image

        for (let curentQuerry = 0; curentQuerry < maxQueries; curentQuerry++) {
            try {
                const { isValidated, value } = await this.transactionMongoModel.findOne(
                    {
                        transactionHash,
                    },
                )
                if (!isValidated)
                    throw new ConflictException("Transaction has been validated.")

                return {
                    message: `Account ${accountId} has deposit successfully.`,
                    others: {
                        amount: computeDenomination(BigInt(value)),
                    },
                }
            } catch (ex) {
                if (curentQuerry < maxQueries) {
                    await sleep(queryIntervalMs)
                } else {
                    throw new NotFoundException("Transaction not found")
                }
            }
        }
    }
}
