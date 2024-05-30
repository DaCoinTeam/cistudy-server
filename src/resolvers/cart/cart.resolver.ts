import { Args, Query, Resolver } from "@nestjs/graphql";
import { CartService } from "./cart.service";
import { CartProductMySqlEntity, CartMySqlEntity } from "@database";
import { FindOneCartInputData } from "./cart.input";




@Resolver()
export class CartResolver {
    constructor(
        private readonly cartService : CartService
    ) { }

    @Query(() => CartMySqlEntity)
    async findOneCart(@Args("data") data: FindOneCartInputData) {
        return await this.cartService.findOneCart({data})
    }
}