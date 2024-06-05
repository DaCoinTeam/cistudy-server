import { CartMySqlEntity, CartCourseMySqlEntity, CourseMySqlEntity, OrderMySqlEntity, OrderCoursesMySqlEntity, UserMySqlEntity } from "@database";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { AddCourseCartInput, CreateCartInput, DeleteCartDataInput, DeleteCartCourseDataInput, CreateOrderInput } from "./cart.input";
import { AddCourseCartOutput, CreateCartOutput, CreateOrderOutput, DeleteCartCourseOutput, DeleteUserCartOutput } from "./cart.output";

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
        @InjectRepository(OrderCoursesMySqlEntity)
        private readonly orderCoursesMySqlRepository: Repository<OrderCoursesMySqlEntity>,
    ) { }

    async createCart(input: CreateCartInput): Promise<CreateCartOutput> {
        const { userId } = input
        const currentcart = await this.cartMySqlRepository.findOne({
            where: {
                userId: userId,
            }
        });

        if (currentcart) {
            if (!currentcart.isDeleted) {
                throw new ConflictException("User Cart is in use")
            }
        }

        const created = await this.cartMySqlRepository.save({
            userId: userId,
        })

        if (created)
            return {
                message: "User cart created Successfully",
                others: { cartId: created.cartId }
            }
    }

    async addCourseCart(input: AddCourseCartInput): Promise<AddCourseCartOutput> {
        const { data, userId } = input;
        const { courseId } = data

        const usercart = await this.cartMySqlRepository.findOne({
            where: {
                userId
            },
        })

        if (!usercart) {
            throw new NotFoundException("User cart not found ore not owned by user")
        }
        const { cartId } = usercart
        const productExist = await this.cartCourseMySqlRepository.findOne({
            where: {
                courseId,
                cartId
            },
        });

        if (productExist) {
            throw new ConflictException("This Course already exist in cart")
        }

        const { cartCourseId } = await this.cartCourseMySqlRepository.save({
            cartId,
            courseId
        })

        // const addedProduct = await this.cartCourseMySqlRepository.findOne({
        //     where: {
        //         productId
        //     },
        //     relations: {
        //         course: true
        //     }
        // })
        const { price } = await this.courseMySqlRepository.findOne({ where: { courseId } })

        usercart.totalprice += price


        await this.cartMySqlRepository.save(usercart)

        return { message: "Product added to cart successfully", others: { cartCourseId } };
    }

    async deleteCartCourse(input: DeleteCartCourseDataInput): Promise<DeleteCartCourseOutput> {
        const { userId, data } = input;
        const { cartCourseIds } = data

        const usercart = await this.cartMySqlRepository.findOne({
            where: {
                userId
            },
        })

        if (!usercart) {
            throw new NotFoundException("User cart not found ore not owned by user")
        }

        const productArray = await this.cartCourseMySqlRepository.find({
            where: {
                cartCourseId: In(cartCourseIds)
            },
            relations: {
                cart: true,
                course: true
            }
        })

        for (const product of productArray) {
            usercart.totalprice -= product.course.price
        }

        await this.cartMySqlRepository.save(usercart)
        await this.cartCourseMySqlRepository.delete({ cartCourseId: In(cartCourseIds) })

        return { message: "Product Removed Successfully", others: { cartId: usercart.cartId } }
    }

    async deleteUserCart(input: DeleteCartDataInput): Promise<DeleteUserCartOutput> {
        const { userId, data } = input
        const { cartId } = data

        const usercart = await this.cartMySqlRepository.findOne({
            where: {
                cartId,
                userId
            },
        })

        if (!usercart) {
            throw new NotFoundException("User cart not found ore not owned by user")
        }

        await this.cartMySqlRepository.delete({ cartId })
        const newcart = await this.cartMySqlRepository.save({ userId })
        return {
            message: "User Cart Deleted Successfully, New cart have been initialized",
            others: {
                cartId: newcart.cartId
            }
        }
    }

    async createOrder(input: CreateOrderInput): Promise<CreateOrderOutput> {
        const { data, userId } = input
        const { courseIds } = data

        const order = await this.orderMySqlRepository.save({
            userId,
        })
        const orderCourses = await this.courseMySqlRepository.find({
            where: {
                courseId: In(courseIds)
            }
        })

        let discountPrice = 0, totalPrice = 0

        for (const course of orderCourses) {
            discountPrice += course.discountPrice
            totalPrice += course.price
            await this.orderCoursesMySqlRepository.save({
                orderId: order.orderId,
                courseId: course.courseId,
                price: course.price,
                discountPrice: course.discountPrice
            })
        }

        await this.orderMySqlRepository.update(order.orderId, {
            totalPrice,
            discountPrice
        })


        //Payment here

        //If payment success, delete courses ordered in cart

        return {
            message: "Order Created Successfully",
            others: {
                orderId: order.orderId
            }
        }
    }
}