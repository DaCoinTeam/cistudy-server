import { UseGuards, UseInterceptors } from "@nestjs/common"
import { Args, Query, Resolver } from "@nestjs/graphql"
import { AccountId, AuthInterceptor, JwtAuthGuard } from "../shared"
import { FindManyOrdersInputData, FindOneOrderInputData } from "./cart.input"
import { FindManyOrdersOutput, FindOneCartOutput, FindOneOrderOutput } from "./cart.output"
import { CartService } from "./cart.service"

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
    @Query(() => FindManyOrdersOutput)
    async findManyOrders(
        @AccountId() accountId : string,
        @Args("data") data: FindManyOrdersInputData) {
        return await this.cartService.findManyOrders({ accountId, data })
    }

    
}