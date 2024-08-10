
import { CartMySqlEntity, OrderMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, Repository } from "typeorm"
import { FindManyOrdersInput, FindOneCartInput, FindOneOrderInput } from "./cart.input"
import { FindManyOrdersOutputData } from "./cart.output"
import { OrderStatus } from "@common"


@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartMySqlEntity)
        private readonly cartMySqlRepository: Repository<CartMySqlEntity>,
        @InjectRepository(OrderMySqlEntity)
        private readonly orderMySqlEntity: Repository<OrderMySqlEntity>,
        private readonly dataSource: DataSource
    ) { }

    async findOneCart(input: FindOneCartInput): Promise<CartMySqlEntity> {
        const { accountId } = input

        const cart = await this.cartMySqlRepository.findOne({
            where: {
                cartId: accountId,
            },
            relations: {
                cartCourses: {
                    course: true,
                    cart: true
                }
            }
        })

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
                },

            }
        })

        return order
    }

    async findManyOrders(input: FindManyOrdersInput): Promise<FindManyOrdersOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take, orderStatus } = { ...options }

        const results = await this.orderMySqlEntity.find(
            {
                where: {
                    orderStatus: orderStatus ? orderStatus : OrderStatus.Completed
                },
                skip,
                take,
                relations: {
                    orderCourses: {
                        course: true
                    },
                    account: true
                },
            })

        const numberOfAccountOrdersResult = await this.orderMySqlEntity.count({})

        return {
            results,
            metadata: {
                count: numberOfAccountOrdersResult,
            }
        }
    }
}