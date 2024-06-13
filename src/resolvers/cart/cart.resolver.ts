import { Args, Query, Resolver } from "@nestjs/graphql";
import { CartService } from "./cart.service";
import { CartMySqlEntity, OrderMySqlEntity } from "@database";
import { FindManyUserOrdersInputData, FindOneOrderInputData } from "./cart.input";
import { UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard, AuthInterceptor, AccountId } from "../shared";
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
        @AccountId() accountId: string,
    ) {
        return await this.cartService.findOneCart({ accountId })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindOneOrderOutput)
    async findOneOrder(
        @AccountId() accountId: string,
        @Args("data") data: FindOneOrderInputData
    ) {
        return await this.cartService.findOneOrder({ accountId, data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyUserOrdersOutput)
    async findManyUserOrders(
        @AccountId() accountId : string,
        @Args("data") data: FindManyUserOrdersInputData) {
        return await this.cartService.findManyUserOrders({ accountId, data })
    }

    
}