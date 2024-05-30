import { CartMySqlEntity, CartProductMySqlEntity, CourseMySqlEntity } from "@database";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { AddProductCartInput, CreateCartInput, DeleteCartDataInput, DeleteCartProductDataInput } from "./cart.input";
import { AddProductCartOutput, CreateCartOutput, DeleteCartProductOutput, DeleteUserCartOutput } from "./cart.output";

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
        const currentcart = await this.cartMySqlRepository.findOne({
            where: {
                userId: userId,
            }
        });

        if(currentcart){
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

    async addProductCart(input: AddProductCartInput): Promise<AddProductCartOutput> {
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

        const productExist = await this.cartProductMySqlRepository.findOne({
            where: {
                courseId,
                cartId,
            },
        });

        if (productExist) {
            throw new ConflictException("This Course already exist in cart")
        }

        const { productId } = await this.cartProductMySqlRepository.save({
            cartId,
            courseId
        })

        // const addedProduct = await this.cartProductMySqlRepository.findOne({
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

        return { message: "Product added to cart successfully", others: { productId } };
    }

    async deleteCartProduct(input: DeleteCartProductDataInput): Promise<DeleteCartProductOutput> {
        const { userId, data } = input;
        const { productId } = data

        const usercart = await this.cartMySqlRepository.findOne({
            where: {
                userId
            },
        })

        if (!usercart) {
            throw new NotFoundException("User cart not found ore not owned by user")
        }

        const productArray = await this.cartProductMySqlRepository.find({
            where: {
                productId : In(productId)
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
        await this.cartProductMySqlRepository.delete({ productId : In(productId) })

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
}