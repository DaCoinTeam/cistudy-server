import { TransactionType } from "@common"
import { AccountMySqlEntity, TransactionMySqlEntity } from "@database"
import { BlockchainService, PaypalService } from "@global"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { CaptureOrderInput, CreateOrderInput } from "./payment.input"
import { CaptureOrderOutput, CreateOrderOutput } from "./payment.output"

@Injectable()
export class PaymentService {
    constructor(
    @InjectRepository(AccountMySqlEntity)
    private readonly accountRepository: Repository<AccountMySqlEntity>,
    @InjectRepository(TransactionMySqlEntity)
    private readonly transactionRepository: Repository<TransactionMySqlEntity>,
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

        const { balance } = await this.accountRepository.findOne({
            where: {
                accountId
            }
        })

        await this.accountRepository.update(accountId, {
            balance: balance + amount
        })

        await this.transactionRepository.save({
            accountId,
            amountDepositedChange: amount,
            payPalOrderId: captured.id,
            type: TransactionType.Buy
        })

        return {
            message: `Captured PayPal order ${orderId} successfully.`,
            others: {
                amount
            }
        }
    }
}
