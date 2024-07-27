import { SystemRoles } from "@common"
import {
    Body,
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger"
import { AccountId, AuthInterceptor, JwtAuthGuard, Roles } from "../shared"
import { RolesGuard } from "../shared/guards/role.guard"
import { CaptureOrderData, CreateOrderData } from "./payment.input"
import { PaymentService } from "./payment.service"

@ApiTags("Payment")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/payment")
export class PaymentController{
    constructor(private readonly paymentService: PaymentService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(AuthInterceptor)
    @Roles(SystemRoles.User)
    @Post("/create-order")
    async createOrder(
        @AccountId() accountId: string,
        @Body() body: CreateOrderData
    ) {     
    	return await this.paymentService.createOrder({
            accountId,
            data: body,
        }) 
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(AuthInterceptor)
    @Roles(SystemRoles.User)
    @Post("/capture-order")
    async captureOrder(
        @AccountId() accountId: string,
        @Body() body: CaptureOrderData
    ) {     
    	return await this.paymentService.captureOrder({
            accountId,
            data: body,
        }) 
    }
}
