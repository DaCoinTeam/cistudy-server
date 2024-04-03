import {
    TRANSFER_SIGNATURE,
    chainInfos,
    decodeTransferLog,
    getWebSocketProvider,
} from "@blockchain"
import { blockchainConfig, databaseConfig } from "@config"
import { TransactionMongo } from "@database"
import { Injectable, Logger, OnModuleInit } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Timeout } from "@nestjs/schedule"
import { Model } from "mongoose"
import { RedisClientType } from "redis"
import { createClient } from "redis"
import Web3 from "web3"

@Injectable()
export class BlockchainEvmService implements OnModuleInit {
    private readonly logger = new Logger(BlockchainEvmService.name)

    redisPubClient: RedisClientType
    async onModuleInit() {
        this.redisPubClient = createClient({
            url: `redis://${databaseConfig().redis.host}:${databaseConfig().redis.port}`,
        })
        await this.redisPubClient.connect()
    }

    constructor(
    @InjectModel(TransactionMongo.name)
    private readonly transactionMongoModel: Model<TransactionMongo>,
    ) {}

  @Timeout(0)
    async subscribe() {
        const promises: Array<Promise<void>> = []
        for (const chainId of Object.keys(chainInfos)) {
            const promise = async () => {
                const provider = getWebSocketProvider(Number.parseInt(chainId))
                const web3 = new Web3(provider)
                
                provider.on("disconnect", error => 
                {
                    this.logger.error(error)
                    provider.connect()
                    web3.setProvider(provider)
                })
              
                const subscriber = await web3.eth.subscribe("logs", {
                    topics: [ TRANSFER_SIGNATURE ],
                })
                subscriber.on("connected", async (connected: string) => {
                    this.logger.verbose(connected)
                })
                subscriber.on("data", async (log) => {
                    try {
                        const { from, to, value } = decodeTransferLog(log)
                        if (
                            web3.utils.toChecksumAddress(to as string) !==
              blockchainConfig().evmAddress
                        )
                            return

                        this.logger.verbose(log.transactionHash)

                        await this.transactionMongoModel.create({
                            transactionHash: log.transactionHash,
                            from,
                            to,
                            value,
                            log
                        })

                        const message: BlockchainEvmServiceMessage = {
                            transactionHash: log.transactionHash,
                        }

                        await this.redisPubClient.publish(
                            BlockchainEvmService.name,
                            JSON.stringify(message),
                        )
                    } catch (ex) {
                        this.logger.error(ex)
                    }
                })
                subscriber.on("error", (error) => {
                    this.logger.error(error)
                })
            }
            promises.push(promise())
        }
        await Promise.all(promises)
    }
}

export interface BlockchainEvmServiceMessage {
  transactionHash: string;
}
