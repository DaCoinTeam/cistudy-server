import { Args, Query, Resolver } from "@nestjs/graphql";
import { CartService } from "./cart.service";
import { CartMySqlEntity, OrderMySqlEntity } from "@database";
import { FindManyUserOrdersInputData, FindOneCartInputData, FindOneOrderInputData } from "./cart.input";
import { UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard, AuthInterceptor, UserId } from "../shared";
import { FindManyUserOrderOutput, FindOneCartOutput, FindOneOrderOutput } from "./cart.output";

@Resolver()
export class CartResolver {
    constructor(
        private readonly cartService: CartService
    ) { }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindOneCartOutput)
    async findOneCart(
        @UserId() userId: string,
        @Args("data") data: FindOneCartInputData
    ) {
        return await this.cartService.findOneCart({ userId, data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindOneOrderOutput)
    async findOneOrder(
        @UserId() userId: string,
        @Args("data") data: FindOneOrderInputData
    ) {
        return await this.cartService.findOneOrder({ userId, data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyUserOrderOutput)
    async findManyUserOrder(
        @UserId() userId : string,
        @Args("data") data: FindManyUserOrdersInputData) {
        return await this.cartService.findManyUserOrder({ userId, data })
    }

    
}