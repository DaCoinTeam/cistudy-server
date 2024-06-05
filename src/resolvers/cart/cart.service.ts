
import { CartMySqlEntity, CartCourseMySqlEntity, OrderMySqlEntity } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FindManyUserOrdersInput, FindOneCartInput, FindOneOrderInput } from "./cart.input";


@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartMySqlEntity)
        private readonly cartMySqlRepository: Repository<CartMySqlEntity>,
        @InjectRepository(CartCourseMySqlEntity)
        private readonly cartCourseMySqlEntity: Repository<CartCourseMySqlEntity>,
        @InjectRepository(OrderMySqlEntity)
        private readonly orderMySqlEntity: Repository<OrderMySqlEntity>,
    ) { }

    async findOneCart(input: FindOneCartInput): Promise<CartMySqlEntity> {
        const { data } = input
        const { params } = data
        const { cartId } = params

        const cart = await this.cartMySqlRepository.findOne({
            where: {
                cartId,
            },
            relations: {
                courses: {
                    course: true,
                    cart: true
                }
            }
        });

        return cart
    }

    async findOneOrder(input: FindOneOrderInput): Promise<OrderMySqlEntity> {
        const { data } = input
        const { params } = data
        const { orderId } = params

        const order = await this.orderMySqlEntity.findOne({
            where: {
                orderId,
            },
            relations: {
                orderCourses: {
                    course: true
                }
            }
        })

        return order
    }

    async findManyUserOrder(input: FindManyUserOrdersInput): Promise<Array<OrderMySqlEntity>> {
        const { userId, data } = input
        const { options } = data
        const { skip, take } = { ...options }
        
        const orders = await this.orderMySqlEntity.find({
            where: {
                userId
            },
            skip,
            take,
        })
        console.log(orders)
        return orders

    }
}