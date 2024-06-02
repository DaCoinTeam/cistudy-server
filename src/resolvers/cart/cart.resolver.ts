import { Args, Query, Resolver } from "@nestjs/graphql";
import { CartService } from "./cart.service";
import { CartMySqlEntity } from "@database";
import { FindOneCartInputData, FindOneOrderInputData } from "./cart.input";




@Resolver()
export class CartResolver {
    constructor(
        private readonly cartService : CartService
    ) { }

    @Query(() => CartMySqlEntity)
    async findOneCart(@Args("data") data: FindOneCartInputData) {
        return await this.cartService.findOneCart({data})
    }

    @Query(() => CartMySqlEntity)
    async findOneOrder(@Args("data") data: FindOneOrderInputData) {
        return await this.cartService.findOneOrder({data})
    }
}