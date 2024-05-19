import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common"
import { AuthManagerService } from "@global"
import { Observable, mergeMap } from "rxjs"
import { AuthTokenType, Payload, Output, getClientId } from "@common"

@Injectable()
export class AuthInterceptor<T extends object>
implements NestInterceptor<T, Output<T>>
{
    constructor(
        private readonly authManagerService: AuthManagerService,
    ) {}
        
    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<Output<T>>> {
        // xử lý tiền request
        // check xem token là refresh hay là access, từ đó đưa ra những lựa chọn

        const request = context.switchToHttp().getRequest()
        const { type, userId, userRole } = request.user as Payload
        const clientId = getClientId(request.headers)


        const refresh = type === AuthTokenType.Refresh
        if (refresh) {
            await this.authManagerService.validateSession(userId, clientId)
        }

        // xử lý response
        return next.handle().pipe(
            mergeMap(async (data) => {
                // thêm cặp tokens vào response nếu yêu cầu gửi request
                return await this.authManagerService.generateOutput<T>(
                    { userId, userRole },
                    data,
                    refresh,
                    clientId,
                )
            }),
        )
    }
}
