import { CartMySqlEntity, CartCourseMySqlEntity, CourseMySqlEntity, OrderMySqlEntity } from "@database";
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

    async addProductCart(input: AddCourseCartInput): Promise<AddCourseCartOutput> {
        const { data, userId } = input;
        const { cartId, courseId } = data

        const usercart = await this.cartMySqlRepository.findOne({
            where: {
                cartId,
                userId
            },
        })

        if (!usercart) {
            throw new NotFoundException("User cart not found ore not owned by user")
        }

        const productExist = await this.cartCourseMySqlRepository.findOne({
            where: {
                courseId,
                cartId,
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
        const { cartCourseId } = data

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
                cartCourseId: In(cartCourseId)
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
        await this.cartCourseMySqlRepository.delete({ cartCourseId: In(cartCourseId) })

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
        const { cartId } = data

        const usercart = await this.cartMySqlRepository.findOne({
            where: {
                cartId,
                userId
            }
        })
        if (!usercart) {
            throw new NotFoundException("This cart cannot be found or it not belongs to user")
        }
        if(usercart.courses.length === 0){
            throw new ConflictException("There arent any courses in cart")
        }
        // Hàm discount/trừ tiền

        //Ghi Order
        const cartdetails = await this.cartMySqlRepository.findOne({ where: { cartId } })

        const { orderId } = await this.orderMySqlRepository.save({
            cartId,
            userId,
            totalprice: cartdetails.totalprice
        })

        return {
            message: "Order Created Successfully",
            others: {
                orderId
            }
        }
    }
}