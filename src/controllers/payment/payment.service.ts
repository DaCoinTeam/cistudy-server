import { Injectable } from "@nestjs/common"
import { BlockchainService, PaypalService } from "@global"
import { CaptureOrderInput, CreateOrderInput } from "./payment.input"
import { CaptureOrderOutput, CreateOrderOutput } from "./payment.output"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { AccountMySqlEntity } from "@database"
import { computeRaw } from "@common"

@Injectable()
export class PaymentService {
    constructor(
    @InjectRepository(AccountMySqlEntity)
    private readonly accountRepository: Repository<AccountMySqlEntity>,
    private readonly paypalService: PaypalService,
    private readonly blockchainService: BlockchainService
    ) {}

    async createOrder(input: CreateOrderInput): Promise<CreateOrderOutput> {
        const { data } = input
        const { amount, isSandbox } = data

        const order = await this.paypalService.createOrder({
            amount,
            isSandbox
        })
    
        return {
            message: "A Paypal order has been created successfully.",
            others: {
                orderId: order.id
            }
        }
    }

    async captureOrder(input: CaptureOrderInput): Promise<CaptureOrderOutput> {
        const { data, accountId } = input
        const { orderId, isSandbox } = data

        const captured = await this.paypalService.captureOrder({
            orderId,
            isSandbox
        })
        
        const amount = Number.parseFloat(captured.purchase_units.at(0).payments.captures.at(0).amount.value)

        const { walletAddress } = await this.accountRepository.findOne({
            where: {
                accountId
            }
        })
        await this.blockchainService.transfer(walletAddress, computeRaw(amount))
        return {
            message: "Capture Paypal order ${} has been created successfully.",
            others: {
                amount: 5
            }
        }
    }
}
