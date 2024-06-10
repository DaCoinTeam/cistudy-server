import { Args, Query, Resolver } from "@nestjs/graphql";
import { CartService } from "./cart.service";
import { CartMySqlEntity, OrderMySqlEntity } from "@database";
import { FindManyUserOrdersInputData, FindOneOrderInputData } from "./cart.input";
import { UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard, AuthInterceptor, UserId } from "../shared";
import { FindManyUserOrdersOutput, FindOneCartOutput, FindOneOrderOutput } from "./cart.output";

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
    ) {
        return await this.cartService.findOneCart({ userId })
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
    @Query(() => FindManyUserOrdersOutput)
    async findManyUserOrders(
        @UserId() userId : string,
        @Args("data") data: FindManyUserOrdersInputData) {
        return await this.cartService.findManyUserOrders({ userId, data })
    }

    
}