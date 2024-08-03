import { AccountMySqlEntity, CartCourseMySqlEntity, CartMySqlEntity, EnrolledInfoMySqlEntity, OrderCourseMySqlEntity, OrderMySqlEntity } from "@database"
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { AddToCartInput, CheckOutInput, DeleteFromCartInput } from "./cart.input"
import { AddToCartOutput, CheckOutOutput, DeleteFromCartOutput } from "./cart.output"

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

        let totalPay = 0

        for (const { course : { price, discountPrice, enableDiscount, courseId}} of cartCourses) {
            const eachPrice = enableDiscount ? discountPrice : price
            totalPay += eachPrice

            const now = new Date()
            now.setFullYear(now.getFullYear() + 1)
            await this.enrolledInfoMySqlRepository.save({
                priceAtEnrolled: eachPrice,
                courseId,
                accountId,
                endDate: now
            })
        }

        const { balance } = await this.accountMySqlRepository.findOne({ where: {
            accountId
        }})

        if (balance < totalPay) throw new ConflictException("Your balance is not enough.")
        await this.accountMySqlRepository.update(accountId, { 
            balance: balance - totalPay
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