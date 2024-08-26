import { AccountMySqlEntity, CartCourseMySqlEntity, CartMySqlEntity, CourseMySqlEntity, EnrolledInfoMySqlEntity, NotificationMySqlEntity, OrderCourseMySqlEntity, OrderMySqlEntity, TransactionMySqlEntity } from "@database"
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { AddToCartInput, CheckOutInput, DeleteFromCartInput } from "./cart.input"
import { AddToCartOutput, CheckOutOutput, DeleteFromCartOutput } from "./cart.output"
import { NotificationType, OrderStatus, TransactionType } from "@common"
import { appConfig } from "@config"
import { ConfigurationService } from "@global"

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
        private readonly transactionMySqlEntity: Repository<TransactionMySqlEntity>,
        private readonly configurationService: ConfigurationService
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
        const earningsMap: { [creatorId: string]: Array<CourseMySqlEntity> } = {}

        for (const { course } of cartCourses) {
            const promise = async () => {
                now.setMonth(now.getMonth() + course.duration)
                const priceAtEnrolled = course.enableDiscount ? course.discountPrice : course.price
        
                await this.enrolledInfoMySqlRepository.save({
                    priceAtEnrolled,
                    courseId: course.courseId,
                    accountId,
                    endDate: now
                })

                await this.orderCoursesMySqlRepository.save({
                    orderId,
                    courseId: course.courseId,
                    price: course.price,
                    discountedPrice: course.discountPrice,
                })

                if (!earningsMap[course.creatorId]) {
                    earningsMap[course.creatorId] = []
                }
                earningsMap[course.creatorId].push(course)

                await this.notificationMySqlRepository.save({
                    senderId: accountId,
                    receiverId: course.creatorId,
                    title: "You have a new enrollment in your course",
                    type: NotificationType.Course,
                    courseId: course.courseId,
                    description: `User ${username} has enrolled in your course: ${course.title}`,
                    referenceLink: `${appConfig().frontendUrl}/courses/${course.courseId}`,
                })
            }
            promises.push(promise())
        }

        await Promise.all(promises)

        const notificationPromises : Array<Promise<void>> = []

        for (const [creatorId, courses] of Object.entries(earningsMap)) {
            let totalEarnings = 0
            for (const course of courses) {
                const { instructor } = await this.configurationService.getConfiguration(course.courseId)
                totalEarnings += (course.enableDiscount ? course.discountPrice : course.price) * (instructor / 100)
            }
            
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
                    type: TransactionType.Received,
                    transactionDetails: earningsMap[creatorId].map(({ courseId, enableDiscount, discountPrice, price }) => ({
                        accountId,
                        courseId,
                        payAmount: enableDiscount ? discountPrice : price,
                        directIn: true,
                    }))
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
            amountDepositedChange: -totalPay,
            type: TransactionType.CheckOut,
            transactionDetails: cartCourses.map(({course}) => ({
                courseId: course.courseId,
                payAmount: course.enableDiscount ? course.discountPrice : course.price,
                directIn: false,
            }))
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