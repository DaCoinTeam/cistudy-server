import { AccountMySqlEntity, CartCourseMySqlEntity, CartMySqlEntity, EnrolledInfoMySqlEntity, NotificationMySqlEntity, OrderCourseMySqlEntity, OrderMySqlEntity, TransactionMySqlEntity } from "@database"
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { AddToCartInput, CheckOutInput, DeleteFromCartInput } from "./cart.input"
import { AddToCartOutput, CheckOutOutput, DeleteFromCartOutput } from "./cart.output"
import { NotificationType, OrderStatus, TransactionType } from "@common"
import { appConfig } from "@config"

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartMySqlEntity)
        private readonly cartMySqlRepository: Repository<CartMySqlEntity>,
        @InjectRepository(CartCourseMySqlEntity)
        private readonly cartCourseMySqlRepository: Repository<CartCourseMySqlEntity>,
        @InjectRepository(OrderMySqlEntity)
        private readonly orderMySqlRepository: Repository<OrderMySqlEntity>,
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(OrderCourseMySqlEntity)
        private readonly orderCoursesMySqlRepository: Repository<OrderCourseMySqlEntity>,
        @InjectRepository(EnrolledInfoMySqlEntity)
        private readonly enrolledInfoMySqlRepository: Repository<EnrolledInfoMySqlEntity>,
        @InjectRepository(NotificationMySqlEntity)
        private readonly notificationMySqlRepository: Repository<NotificationMySqlEntity>,
        @InjectRepository(TransactionMySqlEntity)
        private readonly transactionMySqlEntity: Repository<TransactionMySqlEntity>
    ) { }


    async addToCart(input: AddToCartInput): Promise<AddToCartOutput> {
        const { data, accountId } = input
        const { courseId } = data

        let accountCart = await this.cartMySqlRepository.findOne({ where: { cartId: accountId } })

        if (!accountCart) {
            accountCart = await this.cartMySqlRepository.save({ cartId: accountId })
            await this.accountMySqlRepository.update(accountId, { cart: accountCart })
        }

        const exist = await this.cartCourseMySqlRepository.findOne({ where: { cartId : accountCart.cartId ,courseId } })

        if (exist) {
            throw new ConflictException("This course already exist in cart")
        }

        const { cartCourseId } = await this.cartCourseMySqlRepository.save({
            cartId: accountCart.cartId,
            courseId
        })

        return {
            message: "Course have been added to cart successfully",
            others: {
                cartCourseId
            }
        }
    }

    async deleteFromCart(input: DeleteFromCartInput): Promise<DeleteFromCartOutput> {
        const { accountId, data } = input
        const { cartCourseIds } = data

        const accountCart = await this.cartMySqlRepository.findOne({
            where: {
                cartId: accountId
            },
        })

        if (!accountCart) {
            throw new NotFoundException("Cart is not exist")
        }

        await this.cartCourseMySqlRepository.delete({ cartCourseId: In(cartCourseIds) })

        return { message: "Course(s) have been removed from cart Successfully", others: { cartId: accountCart.cartId } }
    }

    async checkOut(input: CheckOutInput): Promise<CheckOutOutput> {
        const { data, accountId } = input
        const { cartCourseIds } = data

        const cartCourses = await this.cartCourseMySqlRepository.find({
            where: {
                cartCourseId: In(cartCourseIds)
            },
            relations: {
                course: true
            }
        })

        const totalPay = cartCourses.reduce((sum, { course: { price, discountPrice, enableDiscount } }) => {
            return sum + (enableDiscount ? discountPrice : price)
        }, 0)

        const { balance, username } = await this.accountMySqlRepository.findOne({ where: {
            accountId
        }})

        if (balance < totalPay) throw new ConflictException("Your balance is not enough.")

        await this.accountMySqlRepository.update(accountId, { 
            balance: balance - totalPay
        })

        const now = new Date()
        const { orderId } = await this.orderMySqlRepository.save({
            accountId,
            orderStatus: OrderStatus.Completed,
            completeDate: now,
        })

        const promises: Array<Promise<void>> = []
        const earningsMap: { [creatorId: string]: number } = {}

        for (const { course: { price, discountPrice, enableDiscount, courseId, duration, creatorId, title } } of cartCourses) {
            const promise = async () => {
                now.setMonth(now.getMonth() + duration)
                const priceAtEnrolled = enableDiscount ? discountPrice : price
        
                await this.enrolledInfoMySqlRepository.save({
                    priceAtEnrolled,
                    courseId,
                    accountId,
                    endDate: now
                })

                await this.orderCoursesMySqlRepository.save({
                    orderId,
                    courseId,
                    price,
                    discountedPrice: discountPrice,
                })

                if (earningsMap[creatorId]) {
                    earningsMap[creatorId] += priceAtEnrolled / 2
                } else {
                    earningsMap[creatorId] = priceAtEnrolled / 2
                }

                await this.notificationMySqlRepository.save({
                    senderId: accountId,
                    receiverId: creatorId,
                    title: "You have a new enrollment in your course",
                    type: NotificationType.Course,
                    courseId,
                    description: `User ${username} has enrolled in your course: ${title}`,
                    referenceLink: `${appConfig().frontendUrl}/courses/${courseId}`,
                })
            }
            promises.push(promise())
        }

        await Promise.all(promises)

        const notificationPromises : Array<Promise<void>> = []

        for (const [creatorId, totalEarnings] of Object.entries(earningsMap)) {
            const promise = async () => {
                await this.notificationMySqlRepository.save({
                    receiverId: creatorId,
                    title: "You have a new update on your balance!",
                    type: NotificationType.Transaction,
                    description: `You have received ${totalEarnings} STARCI(s)`,
                })

                await this.transactionMySqlEntity.save({
                    accountId: creatorId,
                    amountDepositedChange: totalEarnings,
                    type: TransactionType.Received
                })

                await this.accountMySqlRepository.increment(
                    {
                        accountId: creatorId
                    },
                    "balance",
                    totalEarnings
                )
            }
            notificationPromises.push(promise())
        }

        await Promise.all(notificationPromises)

        await this.transactionMySqlEntity.save({
            accountId,
            amountDepositedChange: totalPay,
            type: TransactionType.CheckOut
        })

        await this.cartCourseMySqlRepository.delete(cartCourseIds)

        return {
            message: "Check out successfully",
            others: {
                orderId: ""
            }
        }
    }
}