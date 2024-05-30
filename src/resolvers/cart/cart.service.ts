
import { CartMySqlEntity, CartProductMySqlEntity } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FindOneCartInput } from "./cart.input";


@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartMySqlEntity)
        private readonly cartMySqlRepository: Repository<CartMySqlEntity>,
        @InjectRepository(CartProductMySqlEntity)
        private readonly cartProductMySqlEntity: Repository<CartProductMySqlEntity>,
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
                products: {
                    course : true
                }
            }
        });

        return cart
    }
}