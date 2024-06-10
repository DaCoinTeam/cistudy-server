import { CartMySqlEntity, CartCourseMySqlEntity, CourseMySqlEntity, OrderMySqlEntity, OrderCourseMySqlEntity, UserMySqlEntity } from "@database";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";
import { AddToCartInput, CheckOutInput, DeleteFromCartInput } from "./cart.input";
import { AddToCartOutput, CheckOutOutput, DeleteFromCartOutput } from "./cart.output";

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartMySqlEntity)
        private readonly cartMySqlRepository: Repository<CartMySqlEntity>,
        @InjectRepository(CartCourseMySqlEntity)
        private readonly cartCourseMySqlRepository: Repository<CartCourseMySqlEntity>,
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        @InjectRepository(OrderMySqlEntity)
        private readonly orderMySqlRepository: Repository<OrderMySqlEntity>,
        @InjectRepository(UserMySqlEntity)
        private readonly userMySqlRepository: Repository<UserMySqlEntity>,
        @InjectRepository(OrderCourseMySqlEntity)
        private readonly orderCoursesMySqlRepository: Repository<OrderCourseMySqlEntity>,
        private readonly dataSource: DataSource,
    ) { }


    async addToCart(input: AddToCartInput): Promise<AddToCartOutput> {
        const { data, userId } = input;
        const { courseId } = data

        let usercart = await this.cartMySqlRepository.findOne({ where: { cartId: userId } })

        if (!usercart) {
            usercart = await this.cartMySqlRepository.save({ cartId: userId })
            await this.userMySqlRepository.update(userId, { cart: usercart })
        }

        const exist = await this.cartCourseMySqlRepository.findOne({ where: { cartId : usercart.cartId ,courseId } })

        if (exist) {
            throw new ConflictException("This course already exist in cart")
        }

        const { cartCourseId } = await this.cartCourseMySqlRepository.save({
            cartId: usercart.cartId,
            courseId
        })

        return {
            message: "Course have been added to cart successfully",
            others: {
                cartCourseId
            }
        };
    }

    async deleteFromCart(input: DeleteFromCartInput): Promise<DeleteFromCartOutput> {
        const { userId, data } = input;
        const { cartCourseIds } = data

        const usercart = await this.cartMySqlRepository.findOne({
            where: {
                cartId: userId
            },
        })

        if (!usercart) {
            throw new NotFoundException("Cart is not exist")
        }

        await this.cartCourseMySqlRepository.delete({ cartCourseId: In(cartCourseIds) })

        return { message: "Course(s) have been removed from cart Successfully", others: { cartId: usercart.cartId } }
    }

    async checkOut(input: CheckOutInput): Promise<CheckOutOutput> {
        const { data, userId } = input
        const { cartCourseIds } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const now = new Date()
            const paymentDue = new Date(now)
            paymentDue.setDate(paymentDue.getDate() + 1);

            const order = await queryRunner.manager.save(OrderMySqlEntity, {
                userId,
                paymentDue
            })

            const cartCourses = await this.cartCourseMySqlRepository.find({
                where: {
                    cartCourseId: In(cartCourseIds)
                },
                relations: {
                    course: true
                }
            })

            const orderCourses = [];
            const deleteCartCourses = [];

            for (const course of cartCourses) {
                orderCourses.push({
                    courseId: course.courseId,
                    orderId: order.orderId,
                    discountedPrice: course.course.discountPrice,
                    price: course.course.price,
                });

                deleteCartCourses.push({ cartCourseId: course.cartCourseId });
            }

            await queryRunner.manager.save(OrderCourseMySqlEntity, orderCourses)

            await queryRunner.commitTransaction()

            await this.cartCourseMySqlRepository.delete(deleteCartCourses)

            return {
                message: "Order Created",
                others: {
                    orderId: order.orderId
                }
            }
        } catch (ex) {
            console.log(ex)
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }
}