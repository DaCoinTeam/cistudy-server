
import { CartMySqlEntity, CartCourseMySqlEntity, OrderMySqlEntity } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FindManyUserOrderInput, FindOneCartInput, FindOneOrderInput } from "./cart.input";


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
        const { cartId, userId } = params

        const cart = await this.cartMySqlRepository.findOne({
            where: {
                cartId,
                userId
            },
            relations: {
                courses: {
                    course: true
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
                cart: {
                    courses: {
                        course: true
                    }
                }

            }
        })
        return order
    }

    async findManyUserOrder(input: FindManyUserOrderInput): Promise<Array<OrderMySqlEntity>> {
        const { data } = input
        const { params } = data
        const { userId } = params

        return await this.orderMySqlEntity.find({
            where: {
                userId
            },
            relations: {
                cart: {
                    courses: {
                        course: true
                    }
                }

            }
        })

    }
}