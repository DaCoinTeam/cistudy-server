import { Body, Controller, Delete, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard, AuthInterceptor, AccountId } from "../shared";
import { CartService } from "./cart.service";
import { AddToCartInputData, CheckOutInputData, DeleteFromCartInputData } from "./cart.input";

@ApiTags("Cart")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/cart")
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @ApiBearerAuth()
    @Post("add-to-cart")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async addtoCart(
        @AccountId() accountId: string,
        @Body() body: AddToCartInputData,
    ) {
        return await this.cartService.addToCart({
            accountId,
            data: body
        })
    }

    @ApiBearerAuth()
    @Post("delete-from-cart")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async deleteCartCourse(
        @AccountId() accountId: string,
        @Body() body: DeleteFromCartInputData,
    ) {
        return this.cartService.deleteFromCart({
            accountId,
            data: body
        })
    }

    @ApiBearerAuth()
    @Post("checkout")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    async checkOut(
        @AccountId() accountId: string,
        @Body() body: CheckOutInputData
    ) {
        return this.cartService.checkOut({
            accountId,
            data: body
        })
    }
}