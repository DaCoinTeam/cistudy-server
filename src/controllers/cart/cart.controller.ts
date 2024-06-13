import { Body, Controller, Delete, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard, AuthInterceptor, AccountId } from "../shared";
import { CartService } from "./cart.service";
import { AddToCartInputData, CheckOutInputData, DeleteFromCartInputData } from "./cart.input";

@ApiTags("Cart")
@ApiHeader({
    name: "refreshToken",
    description: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NzQ1YTg1OC02MmIyLTQ3Y2UtYWRhYi01ZmFhMzY0NTBhMDMiLCJ1c2VyUm9sZSI6InVzZXIiLCJ0eXBlIjoiQWNjZXNzIiwiaWF0IjoxNzE3ODE5NjY4LCJleHAiOjE3MTc4MjMyNjh9.nUyS-hqmn0UMLJsRdhP_Efu3iZTXna7SY51CgLLLcNw",
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
    @Delete("delete-from-cart")
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