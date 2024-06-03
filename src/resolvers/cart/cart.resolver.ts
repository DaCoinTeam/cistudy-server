import { Args, Query, Resolver } from "@nestjs/graphql";
import { CartService } from "./cart.service";
import { CartMySqlEntity, OrderMySqlEntity } from "@database";
import { FindManyUserOrderInputData, FindOneCartInputData, FindOneOrderInputData } from "./cart.input";
import { UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard, AuthInterceptor } from "../shared";
import { FindManyUserOrderOutput } from "./cart.output";




@Resolver()
export class CartResolver {
    constructor(
        private readonly cartService: CartService
    ) { }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => CartMySqlEntity)
    async findOneCart(@Args("data") data: FindOneCartInputData) {
        return await this.cartService.findOneCart({ data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => OrderMySqlEntity)
    async findOneOrder(@Args("data") data: FindOneOrderInputData) {
        return await this.cartService.findOneOrder({ data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyUserOrderOutput)
    async findManyUserOrder(@Args("data") data: FindManyUserOrderInputData) {
        return await this.cartService.findManyUserOrder({ data })
    }
}