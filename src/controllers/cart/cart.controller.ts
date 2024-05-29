import { Body, Controller, Param, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard, AuthInterceptor, UserId } from "../shared";
import { CartService } from "./cart.service";
import { CreateProductCartInputData } from "./cart.input";

@ApiTags("Cart")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/cart")
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @ApiBearerAuth()
    @Post("create-cart")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async createCart(@UserId() userId: string) {
        return await this.cartService.createCart({userId})
    }

    @ApiBearerAuth()
    @Post("add-to-cart")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async addtoCart(
        @UserId() userId: string,
        @Body() body : CreateProductCartInputData,
    ) {
        return await this.cartService.addProductCart({
            userId,
            data: body
        })
    }
}