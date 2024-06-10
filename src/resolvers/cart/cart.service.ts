
import { CartMySqlEntity, CartCourseMySqlEntity, OrderMySqlEntity } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { FindManyUserOrdersInput, FindOneCartInput, FindOneOrderInput } from "./cart.input";
import { FindManyUserOrdersOutputData } from "./cart.output";


@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartMySqlEntity)
        private readonly cartMySqlRepository: Repository<CartMySqlEntity>,
        @InjectRepository(CartCourseMySqlEntity)
        private readonly cartCourseMySqlEntity: Repository<CartCourseMySqlEntity>,
        @InjectRepository(OrderMySqlEntity)
        private readonly orderMySqlEntity: Repository<OrderMySqlEntity>,
        private readonly dataSource: DataSource
    ) { }

    async findOneCart(input: FindOneCartInput): Promise<CartMySqlEntity> {
        const { userId } = input

        const cart = await this.cartMySqlRepository.findOne({
            where: {
                cartId: userId,
            },
            relations: {
                cartCourses: {
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
                },

            }
        })

        return order
    }

    async findManyUserOrders(input: FindManyUserOrdersInput): Promise<FindManyUserOrdersOutputData> {
        const { userId, data } = input
        const { options } = data
        const { skip, take, orderStatus } = { ...options }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        console.log(orderStatus)
        try {
            const results = await this.orderMySqlEntity.find(
                {
                    where: {
                        userId,
                        orderStatus
                    },
                    skip,
                    take,
                    relations: {
                        orderCourses: {
                            course: true
                        }
                    },
                })
            const numberOfUserOrdersResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(OrderMySqlEntity, "order")
                .where("order.orderStatus = :orderStatus", { orderStatus })
                .getRawOne()
            return {
                results,
                metadata: {
                    count: numberOfUserOrdersResult.count,
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }

        return

    }
}