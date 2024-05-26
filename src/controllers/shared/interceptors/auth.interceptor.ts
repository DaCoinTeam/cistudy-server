import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common"
import { AuthManagerService } from "@global"
import { Observable, mergeMap } from "rxjs"
import { AuthTokenType, Payload, AuthOutput, getClientId } from "@common"

@Injectable()
export class AuthInterceptor<T extends object>
implements NestInterceptor<T, AuthOutput<T>>
{
    constructor(
        private readonly authManagerService: AuthManagerService,
    ) {}
        
    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<AuthOutput<T>>> {
        const request = context.switchToHttp().getRequest()
        const { type, userId, userRole } = request.user as Payload
        const clientId = getClientId(request.headers)

        const refresh = type === AuthTokenType.Refresh
        if (refresh) {
            await this.authManagerService.validateSession(userId, clientId)
        }

        return next.handle().pipe(
            mergeMap(async (data) => {
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
