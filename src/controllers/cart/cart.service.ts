import { CartMySqlEntity, CartProductMySqlEntity, CourseMySqlEntity } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddProductCartInput, CreateCartInput } from "./cart.input";
import { AddProductCartOutput, CreateCartOutput } from "./cart.output";

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartMySqlEntity)
        private readonly cartMySqlRepository: Repository<CartMySqlEntity>,
        @InjectRepository(CartProductMySqlEntity)
        private readonly cartProductMySqlRepository: Repository<CartProductMySqlEntity>,
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
    ) { }

    async createCart(input: CreateCartInput): Promise<CreateCartOutput> {
        const { userId } = input
        const { isDeleted } = await this.cartMySqlRepository.findOne({
            where: {
                userId: userId,
            }
        });
        if (!isDeleted) {
            return { message: "User cart is in use" }
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

    async addProductCart(input: AddProductCartInput): Promise<AddProductCartOutput> {
        const { data } = input;
        const { cartId, courseId } = data

        const productExist = await this.cartProductMySqlRepository.findOne({
            where: {
                courseId: data.courseId,
                cartId: cartId,
            },
            relations: {
                course: true
            }
        });

        if (productExist) {
            return { message: "Product already exists in the cart" };
        }

        const { productId } = await this.cartProductMySqlRepository.save({
            cartId,
            courseId: courseId
        })

        const usercart = await this.cartMySqlRepository.findOne({
            where: {
                cartId
            },
        })

        const addedProduct = await this.cartProductMySqlRepository.findOne({
            where: {
                productId
            },
            relations: {
                course: true
            }
        })


        usercart.totalprice += addedProduct.course.price
        usercart.products = []
        usercart.products.push(addedProduct)
        console.log(usercart.totalprice + " + " + usercart.cartId)

        await this.cartMySqlRepository.update(cartId,{})

        return { message: "Product added to cart successfully" };
    }
}